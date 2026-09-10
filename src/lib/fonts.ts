import { Archivo, Hanken_Grotesk, Fraunces } from "next/font/google";
import localFont from "next/font/local";

/**
 * Typography system — pairing "E" (experimental / Hello Monday energy).
 *
 * The brief's families are commercial (PangramPangram): Monument Extended,
 * PP Mori, Editorial New. With no licence files in the repo we ship close FREE
 * look-alikes via next/font (self-hosted, zero layout shift). To use the real
 * fonts later, drop the .woff2 into /public and swap these for next/font/local.
 */

/** Label / eyebrow / numerals — wide architectural grotesque. The variable
 *  width axis is the only wdth axis in the system, so anything that wants to
 *  expand (the ghost capability numerals) must use this face. */
export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
});

/** Body / UI — PP Mori stand-in. Clean, slightly geometric grotesque. */
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

/** DISPLAY + editorial serif. Carries every heading. The opsz axis (9–144)
 *  is driven from globals.css: 72 for headings, 144 for the hero statement, so
 *  hairlines thin out as type grows — the DM Serif / Playfair register the
 *  reference sites buy a separate display face for. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz"],
  style: ["normal"],
});

/** Hero display — Boska (Fontshare, ITF Free Font License, self-hosted).
 *  Not on Google Fonts, so this is the next/font/local path the note at the top
 *  of this file describes. Static Bold and Black, NOT the file Fontshare serves
 *  from its `@variable` URL: that one carries no wght axis. Rendered through a
 *  canvas it produced byte-identical ink at 200, 400, 700 and 900, so a
 *  font-weight declaration against it silently did nothing. Two static cuts cost
 *  ~60KB and actually differ. Served from src/fonts, not /public, so the build
 *  fingerprints them rather than also exposing raw static URLs. */
export const boska = localFont({
  src: [
    { path: "../fonts/Boska-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Boska-Black.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  variable: "--font-boska",
});
