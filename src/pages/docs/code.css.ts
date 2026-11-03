import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { cssFor } from "../../lib/shiki-classes";

// the CSP allows style sheets from 'self' only, so the colours Shiki would have written inline on
// the documentation's code blocks are collected into this file from the rendered pages. Each
// class spells out its own style, so the sheet needs nothing but the HTML
export const GET: APIRoute = async () => {
  const entries = await getCollection("docs");
  const html = entries.map((e) => e.rendered?.html ?? "").join("\n");
  const body = `${cssFor(html)}\n`;
  return new Response(body, { headers: { "Content-Type": "text/css; charset=utf-8" } });
};
