// holds the documentation's colours to the floors the site promises: 7:1 for text and 3:1 for
// lines and focus rings, on every surface a page draws them on. The colours are the high contrast
// entries of src/data/themes.json, the ones /docs/theme.css writes as --docs-* variables, so a
// themes release that lowered one would fail the build here rather than ship
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../src/data/themes.json", import.meta.url), "utf8"));
const TEXT = 7;
const LINE = 3;

const lin = (h) => h.replace("#", "").match(/../g).map((x) => parseInt(x, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
const lum = (h) => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const problems = [];
let checked = 0;
for (const id of ["high-contrast-light", "high-contrast-dark"]) {
  const theme = data.themes.find((t) => t.id === id);
  if (!theme) { problems.push(`themes.json has no ${id} theme`); continue; }
  const ui = theme.ui;
  const surfaces = { background: ui.background, surface: ui.surface, surfaceAlt: ui.surfaceAlt };
  const text = { foreground: ui.foreground, muted: ui.muted, link: ui.link };
  const lines = { border: ui.border, borderActive: ui.borderActive, accent: ui.accent };
  for (const [sName, s] of Object.entries(surfaces)) {
    for (const [tName, t] of Object.entries(text)) {
      checked++;
      const r = ratio(t, s);
      if (r < TEXT) problems.push(`${theme.name}: ${tName} ${t} on ${sName} ${s} is ${r.toFixed(2)}:1, below ${TEXT}:1`);
    }
    for (const [lName, l] of Object.entries(lines)) {
      checked++;
      const r = ratio(l, s);
      if (r < LINE) problems.push(`${theme.name}: ${lName} ${l} on ${sName} ${s} is ${r.toFixed(2)}:1, below ${LINE}:1`);
    }
  }
  // the search excerpt's highlight carries the site's ink on its mark, as the rest of the site does
  checked++;
  if (ratio("#111111", "#ffd400") < TEXT) problems.push("ink on the highlight mark is below 7:1");
}

console.log(`check-contrast: ${checked} pairs checked across the two high contrast themes`);
if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log("check-contrast: every text pair is 7:1 or better and every line 3:1 or better");
