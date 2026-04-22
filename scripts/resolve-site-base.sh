#!/usr/bin/env bash
# Prints the Vite base path (always with trailing slash, or "/" for site root).
# Used by GitHub Actions. Precedence:
# 1. vite.base.json "base" if set (committed config, e.g. "/" for custom domain at apex)
# 2. SITE_BASE_PATH repository variable
# 3. CUSTOM_PAGES_URL set → "/" (custom host serves site at domain root)
# 4. username.github.io repo → "/"
# 5. Else → "/<repo>/"

set -euo pipefail

normalize() {
  local r="$1"
  if [[ -z "$r" ]]; then
    printf '/'
    return
  fi
  [[ "$r" == /* ]] || r="/$r"
  if [[ "$r" != "/" && "$r" != */ ]]; then
    r="${r}/"
  fi
  printf '%s' "$r"
}

if [[ -f vite.base.json ]] && command -v jq >/dev/null 2>&1; then
  root=$(jq -r '.base // empty' vite.base.json | tr -d '\r')
  if [[ -n "$root" ]]; then
    normalize "$root"
    exit 0
  fi
fi

if [[ -n "${SITE_BASE_PATH:-}" ]]; then
  normalize "${SITE_BASE_PATH}"
  exit 0
fi

if [[ -n "${CUSTOM_PAGES_URL:-}" ]]; then
  printf '/'
  exit 0
fi

repo="${GITHUB_REPO_NAME:-}"
owner="${GITHUB_OWNER:-}"
if [[ "$repo" == "${owner}.github.io" ]]; then
  printf '/'
  exit 0
fi

printf '/%s/' "$repo"
