import Video from "@/components/media/Video";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { loop } from "@/lib/media";

const homeHero = loop(
  "/media/hero/home",
  "/media/hero/home.jpg",
  "Brand collateral and branded merchandise on marble, London at dusk and an English estate, an ambient brand film.",
  1920,
  1080,
);

/**
 * Centred hero in the reference layout: eyebrow, large uppercase statement,
 * supporting line, outlined CTA — over a full-bleed ambient loop.
 *
 * Uses the plain <Video>. The hero previously ran through a WebGL fluid
 * surface (cursor bulge, concentric ripples, UV refraction and a specular
 * crest highlight) — that shader was the "water glowing" look, not the
 * footage. It is gone, along with its WebGL context, its per-frame video
 * upload to the GPU and its full-viewport shader.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-(--color-ink)">
      <Video media={homeHero} fill eager sizes="100vw" className="absolute inset-0" />

      {/* Darken BOTH ends and open the middle, rather than the usual
          bottom-heavy gradient. The montage runs from a warm macro of brand
          collateral (dark wall up top, bright marble along the bottom) into
          aerials that invert that — bright sky up top, dark ground below. A
          gradient weighted to either end alone under-scrims one of them.

          scripts/check-hero-scrim.mjs recomputes this composite against the
          poster and fails below AA, so changing the footage cannot quietly
          break the headline the way hand-tuning to a single frame did. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-(--color-ink)/38"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-(--color-ink)/55 via-(--color-ink)/20 to-(--color-ink)/60"
      />

      <div className="container-page relative z-10 flex flex-col items-center pt-[var(--header-h)] text-center">
        <Reveal as="p" className="eyebrow text-(--color-paper-on-dark)/75">
          Your Business & Marketing Partner
        </Reveal>

        <MaskHeading
          as="h1"
          delay={40}
          /* The break is explicit (the \n in the text), not left to wrapping:
             the headline is two sentences, and natural wrapping cannot break
             between them — the second sentence is longer than the first line
             would have to be, so no max-width produces that break. max-w 30ch is
             then just a ceiling wide enough for the longer line to sit on one
             row; it stops deciding the break. No text-balance, for the same
             reason: it would fight the explicit break.

             Boska Bold. The optical-size axis that Fraunces carried is gone
             with it — Boska has no opsz, so pinning it would be inert. Weight is
             the only axis here, and 700 is where the high-contrast fashion cut
             reads without the thin strokes disappearing over the video. */
          className="mt-6 max-w-[30ch] font-(family-name:--font-hero) text-[clamp(1.85rem,4.6vw,4.5rem)] font-bold uppercase leading-[1.1] tracking-[0.015em] text-(--color-paper-on-dark)"
        >
          {"One partner.\nEvery part of your marketing."}
        </MaskHeading>

        <Reveal delay={140}>
          <p className="mx-auto mt-7 max-w-[54ch] text-balance text-(--color-paper-on-dark)/80">
            We work alongside businesses as an extension of their team,
            bringing strategy, creative and execution together under one roof.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <TransitionLink
            href="/contact"
            className="mt-10 inline-flex rounded-full border border-(--color-paper-on-dark)/45 px-9 py-4 text-xs uppercase tracking-[0.18em] text-(--color-paper-on-dark) transition-colors duration-500 hover:border-(--color-accent-on-dark) hover:bg-(--color-accent-on-dark) hover:text-(--color-ink)"
          >
            Get in touch
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
