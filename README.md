# Sadhu J — Aura Portfolio

Cinematic reels-inspired portfolio built with **Next.js 15**, **JSON data files**, and **GitHub Pages** — no database required.

**Live site:** [sadhu2005.github.io/sadhu_portfolio](https://sadhu2005.github.io/sadhu_portfolio/)

## Stack

- Next.js 15 (static export)
- Framer Motion animations
- JSON content in `data/`
- GitHub Actions → GitHub Pages

## Local Development

```bash
npm install
npm run dev          # http://localhost:3000 (no base path)
npm run build:pages  # production build with /sadhu_portfolio base path
npx serve out        # preview static export
```

## Editing Content

All portfolio content lives in `data/`:

| File | Content |
|------|---------|
| `profile.json` | Hero, about, intro video |
| `contact.json` | Email, social links, resume path |
| `education.json` | Education timeline |
| `experience.json` | Work experience |
| `skills.json` | Skill categories |
| `projects.json` | Project cards |
| `tools.json` | Tool utilities |
| `achievements.json` | Hackathons & events |
| `certificates.json` | Certification gallery |
| `site.json` | Site metadata & navigation |

### Add a certificate

1. Add image to `public/certificates/cr36.jpg`
2. Add entry to `data/certificates.json`
3. Commit and push to `main` — auto-deploys in ~2 minutes

### Add media from Hostinger

Download remaining images via SFTP/File Manager into:

```
public/certificates/
public/event-media/
public/projects/
public/video/
```

A full backup snapshot is in `backup/`.

## Deployment

Push to `main` triggers `.github/workflows/github-pages.yml`.

**One-time setup:** GitHub repo → Settings → Pages → Source: **GitHub Actions**

Build uses `BASE_PATH=/sadhu_portfolio` for project site hosting.

## Design Tokens

```css
--aura-bg: #0a0a0f
--aura-primary: #8b5cf6
--aura-secondary: #06b6d4
--aura-glow: rgba(139, 92, 246, 0.35)
```

Animations respect `prefers-reduced-motion`.

## Backup

Pre-migration backup branch: `backup/pre-migration-2026-06-09`  
Local backup folder: `backup/` (content JSON, legacy PHP, manifest)
