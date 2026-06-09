# Portfolio Data Backup

**Date:** 2026-06-09  
**Git branch:** `backup/pre-migration-2026-06-09`

## Contents

| Folder | Description |
|--------|-------------|
| `content/` | Extracted portfolio JSON (source of truth snapshot) |
| `legacy-json/` | Original `public/data/*.json` files |
| `legacy-php/` | Full PHP/MySQL backend archive |
| `media/` | Resume PDF + downloaded media from Hostinger |
| `mysql/` | MySQL dump (add manually via phpMyAdmin) |

## Restore

1. Checkout backup branch: `git checkout backup/pre-migration-2026-06-09`
2. Or copy `content/*.json` back into page components manually
3. Restore PHP from `legacy-php/` to `public/`

## Verification

- achievements.json: 8 events
- certificates.json: 37 entries
- projects.json: 9 projects
- tools.json: 10 tools (includes placeholders)
