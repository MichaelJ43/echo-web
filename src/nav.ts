export type NavId = "home" | "features" | "download" | "docs" | "feedback";

export function initNav(current: NavId): void {
  document.querySelectorAll<HTMLAnchorElement>(".site-nav a[data-nav]").forEach((a) => {
    if (a.dataset.nav === current) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}
