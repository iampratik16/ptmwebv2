import { Archivo, Hanken_Grotesk, Fraunces } from "next/font/google";

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
