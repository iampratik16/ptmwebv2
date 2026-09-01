import Img from "@/components/media/Img";
import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { getAllCaseStudies } from "@/content";
import { img } from "@/lib/media";

/**
 * Full-bleed work panels in the reference layout: tall image columns, each with
 * the client name centred over a hairline rule, a VIEW affordance, and the
 * disciplines set vertically up the left edge.
 *
 * Built on the existing .rail (overflow-x + scroll-snap) rather than a fixed
 * 3-up grid: the reference shows three because it has three, we have five, and
 * a 5-column grid at 1440 gives 288px panels that stop reading as full-height
 * imagery. The rail keeps panel width constant and lets the rest scroll.
 *
 * Art is portrait (2:3) from /media/work-panels — the square card art cropped
 * badly at this aspect, losing the headroom these compositions depend on.
 */

// Explicit slug -> art map. Deriving it from the slug silently resolved
// north-mymms-park to "north" and central-restaurant-lounge to
// "central-restaurant"; an explicit map fails visibly instead.
const PANEL_ART: Record<string, string> = {
  "the-chigwell-marquees": "chigwell",
  "aya-beauty": "aya",
  "swifty-beats": "swifty",
  "central-restaurant-lounge": "central",
  "north-mymms-park": "north-mymms",
};

export default function WorkPanels() {
  const studies = getAllCaseStudies();

  return (
    <section className="relative overflow-hidden bg-(--color-ink)">
      <div className="container-page pt-[var(--section-y)] pb-8 text-center">
        <Reveal
          as="h2"
          className="font-(family-name:--font-label) text-[clamp(1.4rem,2.4vw,2.2rem)] font-light uppercase tracking-[0.08em] text-(--color-paper-on-dark)"
        >
          Selected work
        </Reveal>
        <Reveal as="p" delay={90} className="mx-auto mt-4 max-w-[52ch] text-(--color-paper-on-dark)/70">
          Brands we handle end to end — design and branding, print, digital and
          social, under one roof.
        </Reveal>
      </div>

      <ul className="rail rail--flush pb-[var(--section-y)]" aria-label="Selected work">
        {studies.map((study, i) => (
          <Reveal media key={study.slug} as="li" delay={i * 80} className="rail-item">
            <TransitionLink href={`/work/${study.slug}`} className="work-panel group">
              {/* alt is empty on purpose: the image is inside the link, so its
                  alt folds into the link's accessible name, and the link already
                  renders client / "View" / sector as real text.
                  sizes mirrors the clamp(15rem, 26vw, 24rem) track — a bare 26vw
                  keeps growing past the 24rem ceiling and over-fetches on wide
                  screens; 1477px is where 26vw reaches 384px. */}
              <Img
                media={img(
                  `/media/work-panels/${PANEL_ART[study.slug] ?? study.slug}.jpg`,
                  "",
                  1000,
                  1500,
                )}
                fill
                sizes="(min-width: 1477px) 384px, (min-width: 1024px) 26vw, 72vw"
                className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />

              {/* Scrim: the centred name sits over whatever the photo happens to
                  be doing, so it needs a floor, not a gradient from one edge. */}
              <span aria-hidden className="work-panel__scrim" />

              {/* Disciplines, set vertically up the left edge. */}
              <span aria-hidden className="work-panel__vertical">
                {study.disciplines.slice(0, 2).join(" · ")}
              </span>

              <span className="work-panel__inner">
                <span className="work-panel__name">{study.client}</span>
                <span aria-hidden className="work-panel__rule" />
                <span className="work-panel__view">View</span>
                <span aria-hidden className="work-panel__rule" />
                <span className="work-panel__sector">{study.sector}</span>
              </span>
            </TransitionLink>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
