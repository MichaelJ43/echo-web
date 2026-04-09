# Contributing to the Echo website

## Workflow

Use feature branches and open a **pull request** into `main`. Merging to `main` deploys the production site to the `gh-pages` branch.

## Pull request previews

When you open or update a PR, GitHub Actions builds the site with base path `…/preview/pr-<number>/` and pushes it to `gh-pages`. A bot comment on the PR links to the live preview.

- **GitHub Pages (default):** `https://<owner>.github.io/<repo>/preview/pr-<number>/` for project sites (for example `echo-web`), or `https://<owner>.github.io/preview/pr-<number>/` for a `username.github.io` repository.
- **Custom domain:** set repository variable `CUSTOM_PAGES_URL` to your site origin (no trailing slash), e.g. `https://echo.example.com`. Previews use `${CUSTOM_PAGES_URL}` + the same path suffix as the default host.

Override the automatic site root with repository variable `SITE_BASE_PATH` (e.g. `/echo-web/`) if your publish path should not follow the `/<repository-name>/` default for project sites.

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
