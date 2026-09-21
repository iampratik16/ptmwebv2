/**
 * Asserts the hero headline stays legible over the hero poster once the scrim
 * is applied.
 *
 *   node scripts/check-hero-scrim.mjs [poster.jpg]
 *
 * The scrim in Hero.tsx is two stacked layers, and it was hand-tuned to the
 * luma profile of one specific frame. Swap the footage and the tuning silently
 * stops matching — the gradient can end up opening exactly where the new frame
 * is brightest. This recomputes the composite the browser would produce and
 * fails if the text band drops below WCAG AA.
 *
 * Worst case, not mean: a headline sitting across a bright marble highlight is
 * unreadable even when the band averages fine, so we score the 95th percentile
 * of luminance rather than the average.
 */
import assert from "node:assert/strict";
import sharp from "sharp";

const POSTER = process.argv[2] ?? "public/media/hero/home.jpg";

// Must mirror Hero.tsx. Flat layer, then the top→bottom gradient (stop, alpha).
const FLAT = 0.38;
const GRADIENT = [
  [0.0, 0.55],
  [0.5, 0.2],
  [1.0, 0.6],
];
const INK = [0x1a, 0x10, 0x12];
const TEXT = [0xf2, 0xea, 0xe8]; // --color-paper-on-dark
// The centred content block, as a fraction of frame height: eyebrow through CTA.
const BAND = [0.25, 0.8];
const MIN_RATIO = 4.5;

const gradientAt = (y) => {
  for (let i = 1; i < GRADIENT.length; i++) {
    const [y0, a0] = GRADIENT[i - 1];
    const [y1, a1] = GRADIENT[i];
    if (y <= y1) return a0 + ((a1 - a0) * (y - y0)) / (y1 - y0);
  }
  return GRADIENT.at(-1)[1];
};

const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
/** Browser alpha compositing, in sRGB space, same as a CSS overlay. */
const over = (px, a) => px.map((c, i) => c * (1 - a) + INK[i] * a);

const { data, info } = await sharp(POSTER)
  .raw()
  .toBuffer({ resolveWithObject: true });

const lums = [];
const y0 = Math.floor(info.height * BAND[0]);
const y1 = Math.ceil(info.height * BAND[1]);
for (let y = y0; y < y1; y++) {
  const a = gradientAt(y / info.height);
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    lums.push(lum(over(over([data[i], data[i + 1], data[i + 2]], FLAT), a)));
  }
}

lums.sort((a, b) => a - b);
const p95 = lums[Math.floor(lums.length * 0.95)];
const worst = (lum(TEXT) + 0.05) / (p95 + 0.05);

console.log(`  poster        ${POSTER}`);
console.log(`  band          ${BAND[0] * 100}%-${BAND[1] * 100}% of height`);
console.log(`  p95 luminance ${p95.toFixed(4)}`);
console.log(`  contrast      ${worst.toFixed(2)}:1 (need ${MIN_RATIO}:1)`);
assert.ok(
  worst >= MIN_RATIO,
  `hero text fails AA over the scrimmed poster: ${worst.toFixed(2)}:1`,
);
console.log("  ok  hero scrim keeps the headline at AA");
