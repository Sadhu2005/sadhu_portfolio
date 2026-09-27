# Architecture

This document describes how Signal Desk is put together: the containers, how a request moves through them, how media is stored, and what the database looks like.

- [Containers](#containers)
- [Routing](#routing)
- [Startup and seeding](#startup-and-seeding)
- [Page load flow](#page-load-flow)
- [Media flow](#media-flow)
- [Admin upload flow](#admin-upload-flow)
- [Data model](#data-model)
- [Security boundaries](#security-boundaries)
- [Backups](#backups)

---

## Containers

```mermaid
flowchart TB
    subgraph compose [docker-compose.yml]
        nginx["nginx<br/>nginx:1.27-alpine<br/>publishes :80"]
        web["web<br/>Next.js standalone<br/>node:22-alpine :3000"]
        api["api<br/>FastAPI + Uvicorn<br/>python:3.12-slim :8000"]
        pg[("postgres<br/>postgres:16-alpine :5432")]
    end

    pgdata[/"pgdata volume"/]
    mediavol[/"media volume<br/>/data/media"/]
    datadir[/"./data (ro)<br/>seed JSON"/]
    publicdir[/"./public (ro)<br/>legacy media"/]

    nginx --> web
    nginx --> api
    web --> api
    api --> pg
    pg --- pgdata
    api --- mediavol
    nginx -.->|read-only| mediavol
    api --- datadir
    api --- publicdir
```

| Service | Image | Port | Depends on | Volumes |
|---------|-------|------|------------|---------|
| `postgres` | `postgres:16-alpine` | 5432 (internal) | none | `pgdata` |
| `api` | built from `backend/Dockerfile` | 8000 (internal) | `postgres` healthy | `media`, `./data:ro`, `./public:ro` |
| `web` | built from `Dockerfile` | 3000 (internal) | `api` | none |
| `nginx` | `nginx:1.27-alpine` | **80 (published)** | `web`, `api` | `media:ro`, `deploy/nginx.conf` |

`docker-compose.dev.yml` runs only `postgres` and `api`, and publishes 5432 and 8000 so `npm run dev` on the host can reach them.

---

## Routing

nginx (`deploy/nginx.conf`) is the only entry point.

| Path | Goes to | Notes |
|------|---------|-------|
| `/api/*` | `api:8000` | Public JSON and `/api/admin/*` |
| `/media/{id}` | `api:8000` | Streams a media row by numeric id |
| `/media/<kind>/<file>` | media volume | Served directly by nginx (`alias /data/media/`) |
| `/*` | `web:3000` | Next.js pages and static assets |

`client_max_body_size` is 220 MB so 200 MB uploads fit.

In local development there is no nginx. `next.config.ts` rewrites `/api/*` and `/media/*` to `API_URL` instead, so the browser code is identical in both setups.

With Cloudflare Tunnel, `cloudflared` forwards the public hostname to `http://nginx:80`, and nothing else changes:

```mermaid
flowchart LR
    user([Browser]) -->|HTTPS| cf[Cloudflare edge]
    cf -->|outbound tunnel| cfd[cloudflared on Pi]
    cfd -->|HTTP| nginx[nginx :80]
```

The tunnel is an outbound connection from the Pi, so no router port forwarding is needed. Cloudflare's free plan limits request bodies to 100 MB, so larger uploads should be done on the LAN.

---

## Startup and seeding

```mermaid
sequenceDiagram
    participant D as Docker
    participant P as postgres
    participant A as api container
    participant J as data/*.json

    D->>P: start
    P-->>D: healthcheck pg_isready OK
    D->>A: start (depends_on healthy)
    A->>P: alembic upgrade head
    Note over A,P: 001_initial, 002_skill_icon, 003_skill_level
    A->>P: SELECT profile
    alt profile row exists
        A-->>A: seed skipped
    else empty database
        A->>J: read profile, contact, projects, skills, ...
        A->>P: insert rows + one media row per file path
        A->>A: copy public/SadhuJ_Resume.pdf into media/pdf
    end
    A->>A: uvicorn app.main:app :8000
```

Because the seed skips once a profile exists, restarting or rebuilding never overwrites content edited in `/admin`. To re-seed from the JSON files you need an empty database (`docker compose down -v` wipes both the database and uploaded media).

Until the seed has run, public endpoints return `503 Portfolio is not seeded`.

---

## Page load flow

Each route in `app/` exports `generateMetadata()` (server-side, fetches `/api/site` for the title) and renders a client view from `components/views/`.

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as nginx
    participant W as Next.js
    participant A as FastAPI
    participant P as PostgreSQL

    B->>N: GET /work
    N->>W: proxy
    W->>A: GET http://api:8000/api/site (metadata)
    A->>P: query
    A-->>W: site JSON
    W-->>B: HTML shell + JS
    B->>N: GET /api/projects (useApi)
    N->>A: proxy
    A->>P: load projects, technologies, media
    A-->>B: JSON, media as url /media/42 plus thumbUrl
    B->>N: GET /media/42?variant=thumb
    N->>A: proxy
    A-->>B: webp thumbnail
```

`lib/api.ts` decides the base URL:

- On the server, it uses `API_URL` (`http://api:8000` inside Docker).
- In the browser, it uses `NEXT_PUBLIC_API_URL`, which is empty in Docker, so requests go to the same origin and nginx routes them.

---

## Media flow

A media file has two parts: the bytes on disk and a row in the `media` table. Content tables reference the row by id.

```mermaid
flowchart LR
    row["media row<br/>id, kind, path, thumb_path, mime, caption"]
    req["GET /media/{id}<br/>variant = thumb or original"]
    resolve{"resolve_file()"}
    vol["MEDIA_ROOT/path<br/>uploads"]
    pub["public/path<br/>legacy files"]
    abs["absolute path"]
    ok["FileResponse"]
    missing["404 File is not on disk"]

    req --> row --> resolve
    resolve -->|1st| vol
    resolve -->|2nd| pub
    resolve -->|3rd| abs
    vol --> ok
    pub --> ok
    abs --> ok
    resolve -->|none found| missing
```

When the API serializes content, each media reference becomes:

```json
{ "id": 42, "kind": "image", "url": "/media/42", "thumbUrl": "/media/42?variant=thumb",
  "caption": "...", "missing": false, "filename": "cr35.jpg" }
```

`missing` is checked on every request, so dropping a file into `public/` at the path the seed registered makes a placeholder disappear on the next refresh. `MediaFrame` renders `<Image>`, `<video>` or `<audio>` by `kind`, and shows a "not on disk yet" placeholder when `missing` is true.

Where media is attached:

| Owner | Column or table |
|-------|-----------------|
| Profile photo, intro video | `profile.photo_media_id`, `profile.intro_video_media_id` |
| Resume | `contact.resume_media_id` |
| Project cover, demo, gallery | `project_media(media_id, role, sort_order)` |
| Achievement certificate and gallery | `achievements.certificate_media_id`, `achievement_media` |
| Certificate image | `certificates.media_id` |
| Video poster | `media.poster_id` |

---

## Admin upload flow

```mermaid
sequenceDiagram
    participant U as Admin browser
    participant A as FastAPI
    participant F as Media volume
    participant P as PostgreSQL

    U->>A: POST /api/admin/upload (multipart, X-Admin-Token)
    A->>A: require_admin: compare token
    A->>A: check extension against kind, max 200 MB
    A->>F: write {kind}/{uuid}.{ext} in 1 MB chunks
    opt image and not SVG
        A->>F: write image/{uuid}.webp thumbnail (960px)
    end
    A->>P: INSERT media row
    A-->>U: media id, url, thumbUrl
    U->>A: PUT /api/admin/projects/ID with cover_media_id
    A->>P: UPDATE project_media
```

Accepted types:

| Kind | Extensions |
|------|------------|
| image | jpg, jpeg, png, gif, webp, svg |
| video | mp4, webm, mov |
| audio | mp3, wav, ogg, m4a |
| pdf | pdf |

`DELETE /api/admin/media/{id}` refuses with `409` while any profile, contact, project, achievement, certificate or poster still references the file.

---

## Data model

```mermaid
erDiagram
    MEDIA ||--o{ MEDIA : "poster_id"
    PROFILE }o--o| MEDIA : "photo / intro video"
    CONTACT }o--o| MEDIA : "resume"
    CERTIFICATES }o--o| MEDIA : "image"
    ACHIEVEMENTS }o--o| MEDIA : "certificate"
    ACHIEVEMENTS ||--o{ ACHIEVEMENT_MEDIA : has
    ACHIEVEMENT_MEDIA }o--|| MEDIA : uses
    PROJECTS ||--o{ PROJECT_MEDIA : has
    PROJECT_MEDIA }o--|| MEDIA : uses
    PROJECTS ||--o{ PROJECT_TECHNOLOGIES : lists
    PROJECTS ||--o{ PROJECT_LINKS : links
    SKILLS ||--o{ SKILL_PROJECTS : "used in"
    SKILL_PROJECTS }o--|| PROJECTS : references
    EXPERIENCE ||--o{ EXPERIENCE_BULLETS : has

    MEDIA {
        int id PK
        string kind
        string path UK
        string thumb_path
        string mime
        string caption
        int byte_size
        int poster_id FK
    }
    PROJECTS {
        int id PK
        string slug UK
        string title
        string category
        bool featured
        int progress
        int sort_order
    }
    PROJECT_MEDIA {
        int project_id FK
        int media_id FK
        string role "cover | demo | gallery"
        int sort_order
    }
    SKILLS {
        int id PK
        string category
        string name
        string icon
        string level
    }
    PROFILE {
        int id PK
        string name
        text tagline
        json paragraphs
        int photo_media_id FK
        int intro_video_media_id FK
    }
```

Standalone tables not shown above: `education`, `tools`, `site_settings`, `nav_items`, `workflow_steps` (which references a project by `example_project_slug`).

---

## Security boundaries

- **Only nginx is published.** Postgres, the API and Next.js listen on the internal Docker network. With Cloudflare Tunnel, even port 80 does not need to be open on the router.
- **Admin auth is a single shared token.** `require_admin` accepts `X-Admin-Token` or `Authorization: Bearer`, compared with `secrets.compare_digest`. Use a long random `ADMIN_TOKEN` in production; the `/admin` page is only unlisted, not hidden.
- **`/admin` is not indexed.** `app/admin/layout.tsx` sets `robots: noindex, nofollow`.
- **FastAPI docs are not proxied.** `/docs` exists on port 8000 but nginx only forwards `/api/*` and `/media/*`.
- **CORS** is limited to `CORS_ORIGINS`. In Docker everything is same-origin, so it only matters for local development.
- **Uploads** are type-checked by extension, capped at 200 MB, stored under random UUID names, and deletes are confined to `MEDIA_ROOT`.

---

## Backups

Everything that changes at runtime lives in two places: the `pgdata` volume and the `media` volume. `data/` and `public/` come from git.

```bash
# database
docker compose exec -T postgres pg_dump -U portfolio -d portfolio > backup-$(date +%F).sql

# media
docker run --rm -v sadhu_portfolio_media:/from -v "$PWD":/to alpine \
  tar czf /to/media-$(date +%F).tgz -C /from .
```

Restore:

```bash
docker compose exec -T postgres psql -U portfolio -d portfolio < backup-YYYY-MM-DD.sql
docker run --rm -v sadhu_portfolio_media:/to -v "$PWD":/from alpine \
  tar xzf /from/media-YYYY-MM-DD.tgz -C /to
```

Run both nightly with cron and copy the files off the Pi (for example with `rclone` to cloud storage).
