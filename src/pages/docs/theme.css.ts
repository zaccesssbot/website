import type { APIRoute } from "astro";
import data from "../../data/themes.json";

// the documentation is drawn in the two high contrast themes from the themes release, so a page
// reads the same as the code beside it: light by default, dark when the system or the switch asks
// for it. scripts/check-contrast.mjs holds every pair used here to 7:1 for text and 3:1 for lines
const theme = (id: string) => {
  const t = data.themes.find((x) => x.id === id);
  if (!t) throw new Error(`no ${id} theme in themes.json`);
  return t.ui;
};
const vars = (ui: ReturnType<typeof theme>) => [
  `--docs-bg: ${ui.background}`,
  `--docs-text: ${ui.foreground}`,
  `--docs-muted: ${ui.muted}`,
  `--docs-line: ${ui.border}`,
  `--docs-link: ${ui.link}`,
  `--docs-surface: ${ui.surface}`,
  `--docs-surface-alt: ${ui.surfaceAlt}`,
  `--docs-focus: ${ui.borderActive}`,
  `--docs-accent: ${ui.accent}`,
  `--docs-accent-text: ${ui.accentForeground}`,
].join("; ");

export const GET: APIRoute = () => {
  const light = vars(theme("high-contrast-light"));
  const dark = vars(theme("high-contrast-dark"));
  const body = [
    `:root { ${light}; }`,
    `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${dark}; } }`,
    `:root[data-theme="dark"] { ${dark}; }`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/css; charset=utf-8" } });
};
