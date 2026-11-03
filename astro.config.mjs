// @ts-check
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { styleToClass } from "./src/lib/shiki-classes.ts";

// the documentation's code blocks are drawn in the two high contrast themes, light and dark, from
// the same VS Code theme files the code themes page uses; the site's colour mode picks one
/** @param {string} id */
const theme = (id) => ({
  ...JSON.parse(readFileSync(new URL(`./src/data/themes/zacess-${id}-color-theme.json`, import.meta.url), "utf8")),
  name: `zacess-${id}`,
  type: id.endsWith("dark") ? "dark" : "light",
});

// a markdown table scrolls inside a named region on a narrow screen, as the hand-written pages do,
// so the page itself never moves sideways
/** @type {import("satteri").HastPluginDefinition} */
const scrollTables = {
  name: "zacess:scroll-tables",
  element: [
    {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      visit(node, ctx) { ctx.data.lastHeading = ctx.textContent(node); },
    },
    {
      filter: ["table"],
      visit(node, ctx) {
        const under = ctx.data.lastHeading ? ` under ${ctx.data.lastHeading}` : "";
        ctx.wrapNode(node, {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"], tabindex: "0", role: "region", ariaLabel: `Table${under}` },
          children: [],
        });
      },
    },
  ],
};

export default defineConfig({
  site: "https://zacess.com",
  trailingSlash: "always",
  build: {
    format: "directory",
    // the CSP allows style sheets from 'self' only, so styles must never be inlined
    inlineStylesheets: "never",
  },
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
  markdown: {
    // the documentation is written in plain punctuation and must stay that way: no curly quotes
    // and no dash a page would be failed for
    processor: satteri({ features: { smartPunctuation: false }, hastPlugins: [scrollTables] }),
    shikiConfig: {
      themes: { light: theme("high-contrast-light"), dark: theme("high-contrast-dark") },
      defaultColor: false,
      transformers: [styleToClass],
    },
  },
});
