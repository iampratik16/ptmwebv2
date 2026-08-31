import Img from "@/components/media/Img";
import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { getAllCaseStudies } from "@/content";
import { img } from "@/lib/media";

/**
 * Editorial work grid above the footer: square image, sector eyebrow, client
 * name, one-line outcome, "Read more".
 *
 * Cards carry their own square art from /media/work-cards rather than reusing
 * heroMedia — the hero art is 16:10 and would crop badly into a square tile,
 * and these read as a consistent set only because they were art-directed as
 * one. Everything else (sector, client, outcome, slug) comes from the case
 * study, so the grid cannot drift from the work.
 */
// Explicit slug -> card-art map. Deriving the filename from the slug looked
// tidy but silently resolved "north-mymms-park" to "north"; an explicit map
// means a missing pairing is obvious instead of a 404 at runtime.
const CARD_ART: Record<string, string> = {
  "the-chigwell-marquees": "chigwell",
  "aya-beauty": "aya",
  "swifty-beats": "swifty",
  "central-restaurant-lounge": "central",
  "north-mymms-park": "north-mymms",
};

export default function WorkCardsGrid() {
  const studies = getAllCaseStudies();

  return (
    <section className="section container-page">
      <div className="mx-auto max-w-[52ch] text-center">
        <Reveal
          as="h2"
          className="font-(family-name:--font-label) text-[clamp(1.5rem,2.6vw,2.4rem)] font-light uppercase tracking-[0.06em]"
        >
          Selected work
        </Reveal>
        <Reveal as="p" delay={90} className="mt-4 text-(--color-ink-soft)">
          Brands we handle end to end — design and branding, print, digital and
          social, under one roof.
        </Reveal>
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {studies.map((study, i) => (
          <Reveal media key={study.slug} as="li" delay={i * 70}>
            <TransitionLink href={`/work/${study.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-(--radius-sm)">
                <Img
                  media={img(
                    `/media/work-cards/${CARD_ART[study.slug] ?? study.slug}.jpg`,
                    `${study.client} — ${study.sector}.`,
                    1200,
                    1200,
                  )}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                  className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>

              <p className="eyebrow mt-6">{study.sector}</p>

              <h3 className="mt-3 text-h3 tracking-tight transition-colors duration-500 group-hover:text-(--color-accent-ink)">
                {study.client}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-(--color-ink-soft)">
                {study.oneLineOutcome}
              </p>

              <span className="link-underline mt-5 inline-block text-sm text-(--color-accent-ink)">
                Read more
              </span>
            </TransitionLink>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
