import { defineConfig } from "vite";
import { resolve } from "node:path";

/** Base path for GitHub Pages: /, /echo-web/, or /preview/pr-N/ */
const raw = process.env.VITE_BASE_PATH;
const base =
  raw == null || raw === ""
    ? "/"
    : raw.endsWith("/")
      ? raw
      : `${raw}/`;

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        features: resolve(__dirname, "features.html"),
        download: resolve(__dirname, "download.html"),
        docs: resolve(__dirname, "docs.html"),
        feedback: resolve(__dirname, "feedback.html"),
      },
    },
  },
});
