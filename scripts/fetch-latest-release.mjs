/**
 * Writes public/downloads.json from GitHub Releases API (Echo app repo).
 * Uses GITHUB_TOKEN when set (CI) for a higher rate limit.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "downloads.json");

const repo = process.env.ECHO_APP_REPO ?? "MichaelJ43/echo";
const token = process.env.GITHUB_TOKEN ?? "";

async function writeFallback() {
  const [owner, name] = repo.split("/");
  const fallback = {
    tag_name: "",
    html_url: `https://github.com/${owner}/${name}/releases/latest`,
    assets: [],
  };
  await writeFile(outPath, `${JSON.stringify(fallback, null, 2)}\n`);
  console.warn("fetch-latest-release: wrote fallback downloads.json");
}

const url = `https://api.github.com/repos/${repo}/releases/latest`;
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (token) headers.Authorization = `Bearer ${token}`;

const res = await fetch(url, { headers });
if (!res.ok) {
  console.warn("fetch-latest-release: API", res.status, await res.text());
  await writeFallback();
  process.exit(0);
}

const json = await res.json();
const payload = {
  tag_name: json.tag_name ?? "",
  html_url: json.html_url ?? `https://github.com/${repo}/releases/latest`,
  assets: Array.isArray(json.assets)
    ? json.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
      }))
    : [],
};

await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log("fetch-latest-release:", payload.tag_name, payload.assets.length, "assets");
