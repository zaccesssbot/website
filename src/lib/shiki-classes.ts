import type { ShikiTransformer } from "shiki";

// the CSP allows style sheets from 'self' only, so every inline style Shiki writes becomes a class.
// The class name spells out the style it stands for, so a style sheet can be written from the
// finished HTML alone: the markdown of the docs is rendered when the content is loaded, in a
// different module instance from the one that writes /docs/code.css, so nothing can be shared
// through memory. It works on the finished elements because Shiki 4 adds token styles after the
// tokens hook that transformerStyleToClass from @shikijs/transformers relies on
const PREFIX = "sk-";

export const encode = (style: string): string =>
  PREFIX + style.replace(/[^A-Za-z0-9-]/g, (c) => {
    const code = c.charCodeAt(0);
    return code > 0xff ? `_u${code.toString(16).padStart(4, "0")}` : `_${code.toString(16).padStart(2, "0")}`;
  });

export const decode = (name: string): string =>
  name.slice(PREFIX.length).replace(/_u([0-9a-f]{4})|_([0-9a-f]{2})/g, (_, u, b) => String.fromCharCode(parseInt(u ?? b, 16)));

/** every style seen in this process, for a page that renders its own code and writes its own sheet */
export const classes = new Map<string, string>();

function toClass(node: { properties: Record<string, unknown> }) {
  const style = node.properties.style;
  if (typeof style !== "string" || !style) return;
  const name = encode(style);
  classes.set(name, style);
  delete node.properties.style;
  const existing = node.properties.class;
  node.properties.class = existing ? `${existing} ${name}` : name;
}

export const styleToClass: ShikiTransformer = {
  name: "zacess:style-to-class",
  pre: toClass,
  code: toClass,
  line: toClass,
  span: toClass,
};

/** the rules for every class in a piece of rendered HTML */
export function cssFor(html: string): string {
  const names = new Set<string>();
  for (const m of html.matchAll(/\bsk-[A-Za-z0-9_-]+/g)) names.add(m[0]);
  return [...names].sort().map((name) => `.${name}{${decode(name)}}`).join("\n");
}
