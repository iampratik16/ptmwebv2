import Video from "@/components/media/Video";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { loop } from "@/lib/media";

const homeHero = loop(
  "/media/hero/home",
  "/media/hero/home.jpg",
  "A country manor, classic car, stables and estate at dusk, an ambient brand film.",
  1920,
  1080,
);

/**
 * Centred hero in the reference layout: eyebrow, large uppercase statement,
 * supporting line, outlined CTA — over a full-bleed ambient loop.
 *
 * Uses the plain <Video>, NOT BendVideo. BendVideo puts the clip on a WebGL
 * fluid surface (cursor bulge, concentric ripples, UV refraction and a
 * specular crest highlight) — that shader was the "water glowing" look, not
 * the footage. Dropping it also removes a WebGL context, a per-frame video
 * upload to the GPU and a full-viewport shader from the hero.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-(--color-ink)">
      <Video media={homeHero} fill eager sizes="100vw" className="absolute inset-0" />

      {/* Scrim shaped to the actual frame, measured off the poster: the sky band
          behind the eyebrow reads ~132 luma while the estate and garden bands
          read ~33-37. So darken BOTH ends and open the middle, rather than the
          usual bottom-heavy gradient — that would have crushed the detail that
          makes the shot worth using while leaving the bright sky under-scrimmed. */}
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
          A UK luxury creative consultancy
        </Reveal>

        <MaskHeading
          as="h1"
          delay={40}
          className="mt-6 max-w-[15ch] font-(family-name:--font-label) text-[clamp(1.85rem,4.6vw,4.5rem)] font-light uppercase leading-[1.1] tracking-[0.015em] text-(--color-paper-on-dark)"
        >
          Complete marketing for ambitious brands
        </MaskHeading>

        <Reveal delay={140}>
          <p className="mx-auto mt-7 max-w-[54ch] text-balance text-(--color-paper-on-dark)/80">
            Design and branding, print and merchandise, websites and digital,
            social media — every part of it handled under one roof.
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
