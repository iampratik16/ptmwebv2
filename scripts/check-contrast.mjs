/** Asserts the accent ramp meets WCAG AA against its intended background. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const tok = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `missing token --color-${name}`);
  return m[1];
};

const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const paper = tok("paper");
const ink = tok("ink");

const checks = [
  ["accent-ink on paper (small text)", tok("accent-ink"), paper, 4.5],
  ["accent on paper (large display)", tok("accent"), paper, 3.0],
  ["accent-on-dark on ink (small text)", tok("accent-on-dark"), ink, 4.5],
  ["accent-on-dark on oxblood (small text)", tok("accent-on-dark"), tok("oxblood"), 4.5],
  ["paper-on-dark on oxblood (body)", tok("paper-on-dark"), tok("oxblood"), 4.5],
  ["gold icon ring on white card (non-text)", tok("gold"), "#ffffff", 3.0],
  ["ink on paper (body)", ink, paper, 4.5],
];

for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  assert.ok(r >= min, `${label}: ${fg} on ${bg} = ${r.toFixed(2)}:1, need ${min}:1`);
  console.log(`  ok  ${label} — ${r.toFixed(2)}:1`);
}
console.log("contrast: all pass");
