# Contributing to the Echo website

## Workflow

Use feature branches and open a **pull request** into `main`. Merging to `main` deploys the production site to the `gh-pages` branch.

## Pull request previews

When you open or update a PR, GitHub Actions builds the site with base path `…/preview/pr-<number>/` and pushes it to `gh-pages`. A bot comment on the PR links to the live preview.

- **GitHub Pages (default):** `https://<owner>.github.io/<repo>/preview/pr-<number>/` for project sites (for example `echo-web`), or `https://<owner>.github.io/preview/pr-<number>/` for a `username.github.io` repository.
- **Custom domain:** set repository variable `CUSTOM_PAGES_URL` to your site origin (no trailing slash), e.g. `https://echo.example.com`. Previews use `${CUSTOM_PAGES_URL}` + the same path suffix as the default host.

### Base path (`VITE_BASE_PATH`)

Assets and links break if the built base path does not match where the site is served:

- **`https://<user>.github.io/<repo>/`** → base must be `/<repo>/` (the default when this repo is not `username.github.io`).
- **Custom domain at the apex** (e.g. `https://echo.michaelj43.dev/`) → base must be **`/`**.

Configure that in one of these ways (first match wins in CI):

1. **`vite.base.json`** in the repo root — `{ "base": "/" }` or `{ "base": "/echo-web/" }`. This repo includes `"base": "/"` so **GitHub Pages + custom domain at root** works without extra variables.
2. Repository variable **`SITE_BASE_PATH`** — explicit override (e.g. `/echo-web/`).
3. Repository variable **`CUSTOM_PAGES_URL`** set (any value) — CI uses base **`/`** (same as a custom host serving the site at domain root).

If you delete `vite.base.json` and rely on defaults, set **`SITE_BASE_PATH`** or **`CUSTOM_PAGES_URL`** when using a custom domain, or production CSS will 404 under `/echo-web/...` paths.

When a PR is **closed** or **merged**, the workflow removes `preview/pr-<number>/` from `gh-pages`.

## Local build

```bash
npm ci
npm run fetch-release   # optional; needs network — writes public/downloads.json
npm run build
```

To mimic a PR preview locally:

```bash
set VITE_BASE_PATH=/preview/pr-1/
npm run build
```

(PowerShell: `$env:VITE_BASE_PATH='/preview/pr-1/'; npm run build`)

## GitHub Pages settings

In the repository **Settings → Pages**, choose **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**.

The first successful run of **Deploy site** (on push to `main`) creates the `gh-pages` branch if it does not exist yet.
