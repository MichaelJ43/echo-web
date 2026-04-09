export type ReleaseAsset = { name: string; browser_download_url: string };

export type OsKind = "win" | "mac" | "linux" | "unknown";

export function detectOs(): OsKind {
  const ua = navigator.userAgent.toLowerCase();
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const plat = (nav.userAgentData?.platform ?? "").toLowerCase();
  if (ua.includes("windows") || plat.includes("win")) return "win";
  if (ua.includes("mac os") || ua.includes("macintosh") || plat.includes("mac")) return "mac";
  if (ua.includes("linux") || plat.includes("linux") || ua.includes("android")) return "linux";
  return "unknown";
}

function installAssets(assets: ReleaseAsset[]): ReleaseAsset[] {
  return assets.filter((a) => {
    const n = a.name.toLowerCase();
    return (
      !n.endsWith(".sig") &&
      !n.endsWith(".sha256sum") &&
      !n.endsWith(".json")
    );
  });
}

export function pickAssetForOs(
  assets: ReleaseAsset[],
  os: OsKind,
): ReleaseAsset | null {
  const candidates = installAssets(assets);
  if (!candidates.length) return null;
  const lower = (n: string) => n.toLowerCase();
  if (os === "win") {
    const msi = candidates.find((a) => lower(a.name).endsWith(".msi"));
    if (msi) return msi;
    const exe = candidates.find((a) => lower(a.name).endsWith(".exe"));
    return exe ?? null;
  }
  if (os === "mac") {
    const dmg = candidates.find((a) => lower(a.name).endsWith(".dmg"));
    return dmg ?? null;
  }
  if (os === "linux") {
    const appimage = candidates.find(
      (a) =>
        lower(a.name).endsWith(".appimage") || /\.AppImage$/i.test(a.name),
    );
    if (appimage) return appimage;
    const deb = candidates.find((a) => lower(a.name).endsWith(".deb"));
    return deb ?? null;
  }
  return null;
}

export function osLabel(os: OsKind): string {
  switch (os) {
    case "win":
      return "Windows";
    case "mac":
      return "macOS";
    case "linux":
      return "Linux";
    default:
      return "your platform";
  }
}
