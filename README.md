# Sadhu J — Signal Desk

Portfolio for an ML fullstack developer. Next.js reads a FastAPI + PostgreSQL API. Images, video, audio, and the resume PDF live on disk. An unlisted admin updates copy without a rebuild.

The JSON files in `data/` are the seed source. The public site does not read them at runtime.

**Legacy public URL:** [sadhu2005.github.io/sadhu_portfolio](https://sadhu2005.github.io/sadhu_portfolio/) still comes from [.github/workflows/github-pages.yml](.github/workflows/github-pages.yml). That workflow is legacy until this Pi deploy is the one you use. `npm run build:pages` still sets `BASE_PATH=/sadhu_portfolio` for that old path. The Pi site uses an empty base path.

## Stack

- Next.js (server, `output: "standalone"`)
- FastAPI
- PostgreSQL
- Nginx
- Media volume for image, video, audio, and PDF files

## Local development

Copy the env file and start Postgres plus the API:

```bash
copy .env.example .env
docker compose -f docker-compose.dev.yml up --build
```

In a second terminal:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API is on port 8000. The admin token in `.env.example` is `dev-admin-token`. Sign in at [http://localhost:3000/admin](http://localhost:3000/admin). That page is not in the public nav.

Do not run `npm audit fix --force`.

## Raspberry Pi

Put the database volume and the media volume on a USB SSD when you can. An SD card wears out if it holds Postgres and video.

```bash
git clone <your-repo> sadhu_portfolio
cd sadhu_portfolio
copy .env.example .env
# set ADMIN_TOKEN in .env
docker compose up -d --build
```

Nginx listens on port 80 and routes `/` to Next.js, `/api` to FastAPI, and `/media` to the media volume (numeric ids are streamed by the API from that same volume).

```bash
docker compose up -d
```

Restart policy is `unless-stopped`, so the stack comes back after a reboot once Docker does.

## Editing content

Change live content in `/admin`, or edit `data/*.json` and re-seed an empty database. The seed command skips when a profile row already exists.

| File | Content |
|------|---------|
| `profile.json` | Hero, about, intro video path |
| `contact.json` | Email, social links |
| `education.json` | Education timeline |
| `experience.json` | Work experience |
| `skills.json` | Skill categories, split into one row per skill |
| `projects.json` | Project cards |
| `tools.json` | Tool utilities |
| `achievements.json` | Hackathons and events |
| `certificates.json` | Certification gallery |
| `site.json` | Title and description |

Missing image and video files from the old host show a placeholder until you upload them in admin.

## Design tokens

```css
--bg: #090b10
--surface: #141820
--text: #f3efe6
--muted: #a39e93
--copper: #d4894c
--mint: #5ee0c3
```

The name uses Fraunces. UI text uses Inter. Animations are limited to the hero and the workflow rail, and they stop when `prefers-reduced-motion` is set.
