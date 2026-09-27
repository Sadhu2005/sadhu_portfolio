# Sadhu J — Signal Desk

A self-hosted portfolio for an ML and full-stack developer. The site is a Next.js frontend that reads everything from a FastAPI + PostgreSQL API. Images, video, audio and the resume PDF live on disk and are streamed by the API. An unlisted admin page edits content and uploads media without a rebuild.

It is built to run on a **Raspberry Pi 5** with Docker Compose, and can be exposed to the internet through **Cloudflare Tunnel** without opening router ports.

- **Architecture and request flows:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Legacy static site:** [sadhu2005.github.io/sadhu_portfolio](https://sadhu2005.github.io/sadhu_portfolio/), built by [.github/workflows/github-pages.yml](.github/workflows/github-pages.yml). That workflow predates the API and should be disabled once the Pi deploy is live.

---

## Architecture at a glance

```mermaid
flowchart LR
    visitor([Visitor browser])
    admin([Admin browser])

    subgraph edge [Internet edge]
        cf[Cloudflare DNS + HTTPS]
        tunnel[cloudflared tunnel]
    end

    subgraph pi [Raspberry Pi 5 - Docker Compose]
        nginx[nginx :80]
        web[Next.js standalone :3000]
        api[FastAPI + Uvicorn :8000]
        pg[(PostgreSQL 16)]
        media[("Media volume<br/>/data/media")]
        public[("public folder<br/>legacy files, read-only")]
    end

    visitor --> cf
    admin --> cf
    cf --> tunnel --> nginx
    nginx -- "/" --> web
    nginx -- "/api/*" --> api
    nginx -- "/media/{id}" --> api
    web -- "server-side fetch<br/>http://api:8000" --> api
    api --> pg
    api --> media
    api -. fallback .-> public
```

Only nginx is reachable from outside the Docker network. PostgreSQL, FastAPI and Next.js are never exposed to the internet directly. On a LAN you can skip Cloudflare and open `http://<pi-ip>/`.

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router, `output: "standalone"`), React 19, TypeScript, plain CSS |
| Backend | FastAPI, SQLAlchemy 2, Alembic, Pydantic Settings, Pillow |
| Database | PostgreSQL 16 |
| Media | Files on a Docker volume, metadata in the `media` table |
| Proxy | nginx 1.27 |
| Runtime | Docker Compose, `restart: unless-stopped` |
| Public access | Cloudflare Tunnel (planned) |

---

## How it works

1. **Seed on first start.** The API container runs `alembic upgrade head`, then `python -m app.seed`, then Uvicorn. The seed reads `data/*.json` into Postgres and registers every image path as a row in the `media` table. It skips if a profile row already exists, so restarts never overwrite admin edits.
2. **Pages read the API.** Each route in `app/` is a thin wrapper around a client view in `components/views/`. Views call `useApi()`, which fetches `/api/...` from the same origin. The JSON files are not read at runtime.
3. **Media is referenced by id.** The API returns media as `{ id, kind, url: "/media/{id}", thumbUrl, missing }`. `GET /media/{id}` streams the file from the media volume, falling back to `public/` for legacy files. Missing files render a "not on disk yet" placeholder instead of a broken image.
4. **Admin edits go straight to the database.** `/admin` signs in with `ADMIN_TOKEN` and calls `/api/admin/*` with an `X-Admin-Token` header. Uploads are saved as `{kind}/{uuid}.{ext}` with a 960px webp thumbnail for images.

Sequence diagrams for each of these are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Project structure

```text
app/                    Next.js routes (/, /work, /work/[slug], /skills, /experience,
                        /achievements, /certifications, /tools, /admin)
components/
  views/                Page views that fetch from the API (HomeView, WorkView, ...)
  admin/AdminApp.tsx    Unlisted admin: profile, projects, skills, proof, workflow, upload
  MediaFrame.tsx        Renders image / video / audio or a placeholder
  RevealSection.tsx     Scroll-reveal wrapper and stagger helper
  ScrollRail.tsx        Horizontal rails on the home page
hooks/useInView.ts      IntersectionObserver hook for reveals
lib/
  api.ts                apiBase(), mediaSrc(), typed getters for every endpoint
  useApi.ts             Client-side fetch hook
  types.ts              API payload types
backend/
  app/main.py           FastAPI app and routers
  app/models.py         SQLAlchemy models
  app/routers/          public.py (/api), admin.py (/api/admin), media.py (/media)
  app/media_service.py  Upload, thumbnail, resolve and delete logic
  app/seed.py           Seeds the database from data/*.json
  alembic/versions/     Schema migrations
data/                   Seed content (JSON)
public/                 Legacy media and static assets
deploy/nginx.conf       Reverse proxy rules
docker-compose.yml      Full stack: postgres, api, web, nginx
docker-compose.dev.yml  Postgres + API only, for `npm run dev`
```

---

## Local development

Start Postgres and the API in Docker, and run Next.js on your machine for hot reload.

```bash
copy .env.example .env          # Windows; use cp on macOS/Linux
docker compose -f docker-compose.dev.yml up --build
```

In a second terminal:

```bash
npm install
npm run dev
```

| URL | What |
|-----|------|
| http://localhost:3000 | Site |
| http://localhost:3000/admin | Admin (token `dev-admin-token`) |
| http://localhost:8000/docs | FastAPI interactive docs |
| http://localhost:8000/api/health | Health check |

Do not run `npm audit fix --force`.

## Full stack in Docker

This is the same stack the Pi runs.

```bash
docker compose up -d --build
docker compose logs -f api      # watch migrations and seed
```

Open http://localhost. Stop with `docker compose down`. **`docker compose down -v` deletes the database and every uploaded file.**

---

## Environment variables

| Variable | Used by | Example |
|----------|---------|---------|
| `DATABASE_URL` | api | `postgresql+psycopg://portfolio:portfolio@postgres:5432/portfolio` |
| `MEDIA_ROOT` | api | `/data/media` |
| `ADMIN_TOKEN` | api | a long random string (`openssl rand -hex 32`) |
| `CORS_ORIGINS` | api | `https://yourdomain.com` |
| `PORTFOLIO_ROOT` | api | `/portfolio` (where `data/` and `public/` are mounted) |
| `API_URL` | web | `http://api:8000` (server-side fetches) |
| `NEXT_PUBLIC_API_URL` | web | empty in Docker, so the browser uses the same origin |

---

## Editing content

Use `/admin` for live changes. Editing `data/*.json` only matters for a fresh database, because the seed skips once a profile exists.

| Admin tab | What it changes |
|-----------|-----------------|
| Profile | Name, tagline, email |
| Projects | Create and edit projects, set a cover from the last upload |
| Skills | Skill groups, icons and levels |
| Proof | Add education, achievements and certificates; reorder experience |
| Workflow | The five-step workflow rail on the home page |
| Upload | Upload an image, video, audio file or PDF and get its media id |

Slots the admin UI does not expose yet (profile photo, intro video, project gallery) can be set through the API, for example `PUT /api/admin/profile` with `{"photo_media_id": 120}`.

---

## Deploying on a Raspberry Pi

Keep Postgres and media on a USB SSD. An SD card wears out quickly under database writes and video.

```bash
git clone https://github.com/Sadhu2005/sadhu_portfolio.git
cd sadhu_portfolio
cp .env.example .env            # set a strong ADMIN_TOKEN and CORS_ORIGINS
docker compose up -d --build
```

Roadmap from bare Pi to public site:

```mermaid
flowchart TD
    v0[V0 Pi foundation<br/>SSH, fixed LAN IP, SSD mount] --> v1[V1 Docker + Compose]
    v1 --> v2[V2 Clone repo, set .env, compose up]
    v2 --> v3[V3 Verify site, API, admin, media on LAN]
    v3 --> v4[V4 Cloudflare Tunnel to nginx]
    v4 --> v5[V5 Buy domain]
    v5 --> v6[V6 DNS + HTTPS via Cloudflare]
    v6 --> v7[V7 Backups + monitoring]
    v7 --> v8[V8 GitHub to Pi auto-deploy]
```

Backups need two things: a `pg_dump` of the database and a copy of the `media` volume. Details are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#backups).

---

## Design

```css
--bg: #090b10
--surface: #141820
--text: #f3efe6
--muted: #a39e93
--copper: #d4894c
--mint: #5ee0c3
```

The name uses Fraunces and UI text uses Inter. Motion covers the hero entrance, scroll reveals with a short stagger, a hide-on-scroll navbar and the workflow rail. All of it turns off when `prefers-reduced-motion` is set.
