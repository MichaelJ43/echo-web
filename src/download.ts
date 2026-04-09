import "./style.css";
import { initNav } from "./nav";
import {
  detectOs,
  osLabel,
  pickAssetForOs,
  type ReleaseAsset,
} from "./pick-release-asset";

initNav("download");

const ECHO_RELEASES = "https://github.com/MichaelJ43/echo/releases/latest";

type DownloadsPayload = {
  tag_name: string;
  html_url: string;
  assets: ReleaseAsset[];
};

async function loadDownloads(): Promise<DownloadsPayload | null> {
  const url = `${import.meta.env.BASE_URL}downloads.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as DownloadsPayload;
    if (!data.assets?.length) return null;
    return data;
  } catch {
    return null;
  }
}

function render(
  root: HTMLElement,
  data: DownloadsPayload | null,
  os: ReturnType<typeof detectOs>,
): void {
  const primarySlot = root.querySelector<HTMLElement>("[data-download-primary]");
  const metaSlot = root.querySelector<HTMLElement>("[data-download-meta]");
  const listSlot = root.querySelector<HTMLElement>("[data-download-list]");

  if (!primarySlot || !metaSlot || !listSlot) return;

  if (!data) {
    primarySlot.innerHTML = `<a class="btn btn-primary" href="${ECHO_RELEASES}">View releases</a>`;
    metaSlot.textContent =
      "Could not load release metadata. Open GitHub Releases to download installers for Windows, macOS, and Linux.";
    listSlot.innerHTML = "";
    return;
  }

  const picked = pickAssetForOs(data.assets, os);
  const label = osLabel(os);

  if (picked && os !== "unknown") {
    primarySlot.innerHTML = `<a class="btn btn-primary" href="${picked.browser_download_url}" rel="noopener">Download for ${label}</a>`;
    metaSlot.textContent = `${data.tag_name} — ${picked.name}`;
  } else {
    primarySlot.innerHTML = `<a class="btn btn-primary" href="${data.html_url || ECHO_RELEASES}">Latest release (${data.tag_name})</a>`;
    metaSlot.textContent =
      os === "unknown"
        ? `${data.tag_name} — Pick an installer below or on GitHub.`
        : `${data.tag_name} — No matching installer found for ${label}; use the list below or GitHub Releases.`;
  }

  const listed = data.assets.filter(
    (a) =>
      !a.name.toLowerCase().endsWith(".sig") &&
      !a.name.toLowerCase().endsWith(".json"),
  );
  const items = listed
    .map(
      (a) =>
        `<li><a href="${a.browser_download_url}" rel="noopener">${escapeHtml(a.name)}</a></li>`,
    )
    .join("");
  listSlot.innerHTML = `<p class="download-meta">All files for ${escapeHtml(data.tag_name)}</p><ul class="asset-list">${items}</ul>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const root = document.querySelector<HTMLElement>("[data-download-root]");
if (root) {
  void loadDownloads().then((data) => render(root, data, detectOs()));
}
