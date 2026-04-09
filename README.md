# echo-web

Public website for **[Echo](https://github.com/MichaelJ43/echo)** — source for GitHub Pages (marketing, download links, docs summaries, feedback).

## Develop

```bash
npm ci
npm run dev
```

## Deploy

Push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Pull request previews and cleanup are handled by [.github/workflows/preview.yml](.github/workflows/preview.yml).

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch flow, preview URLs, and `SITE_BASE_PATH` / `CUSTOM_PAGES_URL`.

## Screenshots

Place images in [public/images/screenshots/](public/images/screenshots/) — see that folder’s README for filenames.
