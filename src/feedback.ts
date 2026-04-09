import "./style.css";
import { initNav } from "./nav";

initNav("feedback");

const REPO = "MichaelJ43/echo";
const BUG_TEMPLATE =
  `https://github.com/${REPO}/issues/new?template=bug_report.yml`;
const FEATURE_TEMPLATE =
  `https://github.com/${REPO}/issues/new?template=feature_request.yml`;

const form = document.querySelector<HTMLFormElement>("[data-feedback-form]");
const typeSelect = document.querySelector<HTMLSelectElement>(
  "[data-feedback-type]",
);
const titleInput = document.querySelector<HTMLInputElement>(
  "[data-feedback-title]",
);
const bodyInput = document.querySelector<HTMLTextAreaElement>(
  "[data-feedback-body]",
);

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput?.value.trim() ?? "";
  const body = bodyInput?.value.trim() ?? "";
  const kind = typeSelect?.value ?? "idea";

  const base = kind === "bug" ? BUG_TEMPLATE : FEATURE_TEMPLATE;
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (body) params.set("body", body);
  const q = params.toString();
  const url = q ? `${base}&${q}` : base;
  window.open(url, "_blank", "noopener,noreferrer");
});
