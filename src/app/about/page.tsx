import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import Figure from "@/components/media/Figure";
import { img } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pink Tree Media is a full-service marketing consultancy. Strategy, creative, digital, social, websites and print handled by one experienced team, with one point of contact.",
  alternates: { canonical: "/about" },
};

/**
 * The four blocks carry the argument, so the headings are plain statements
 * rather than one-word labels ("Experience", "Approach", "Quality"). A label
 * makes the reader do the work of inferring the point; a sentence just makes it.
 *
 * `stat` renders the figure at display size. Only Experience uses it: one large
 * number reads as evidence, and repeating the treatment would flatten it back
 * into decoration.
 */
const BLOCKS = [
  {
    heading: "Over a decade of it",
    stat: "10+",
    statLabel: "Years",
    body: "Ten years and more across hospitality, events, beauty and lifestyle, working with businesses where how things look and read genuinely affects whether people buy.",
  },
  {
    heading: "Everything in one place",
    body: "Strategy, creative, digital, social, websites, print and merchandise, planned together rather than commissioned separately from five different suppliers.",
  },
  {
    heading: "Fewer clients, more attention",
    body: "We take on a small number of businesses at a time. It means the person who understands your account is the person actually doing the work.",
  },
  {
    heading: "Partnership",
    body: "Our best relationships are long-term. We become an extension of the businesses we work with, someone to call when there is an idea, an opportunity, a problem to solve or simply a question about what to do next.",
  },
];

const about01 = img("/media/about/01.jpg", "A calm executive office with warm walnut interiors and a city view.", 1600, 2000);
const about02 = img("/media/about/02.jpg", "A boardroom overlooking the London skyline at golden hour.", 2560, 1600);
const about03 = img("/media/about/03.jpg", "The City of London skyline at golden hour.", 2400, 1600);
const about04 = img("/media/about/04.jpg", "A warm, plant-filled creative office with skyline views.", 2400, 1600);
const about05 = img("/media/about/05.jpg", "A boardroom set for a business meeting, the city beyond.", 2400, 1600);

export default function AboutPage() {
  return (
    <div className="container-page">
      {/* Intro */}
      <header className="grid gap-y-10 pb-[clamp(3rem,8vh,6rem)] pt-[calc(var(--header-h)+clamp(3rem,10vh,8rem))] md:grid-cols-12">
        <Reveal as="p" className="eyebrow md:col-span-3">
          About
        </Reveal>
        <div className="md:col-span-9">
          <MaskHeading
            as="h1"
            className="max-w-[16ch] text-h1 font-light leading-[1.05] tracking-tight"
          >
            We become part of your team
          </MaskHeading>
          <Reveal delay={140}>
            <p className="mt-9 max-w-[58ch] text-h3 font-light leading-relaxed">
              Pink Tree Media is a full-service marketing consultancy built
              around a simple idea: businesses shouldn’t need five different
              companies to manage their marketing.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-[58ch] text-(--color-ink-soft)">
              We bring strategy, creative, digital, social media, websites,
              print and merchandise together, giving our clients one experienced
              team and one point of contact.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Lead image — the LCP element; preload it eagerly (was lazy-loaded). */}
      <Figure media={about02} sizes="(min-width: 1600px) 1600px, 100vw" rounded parallax priority className="mb-(--section-y)" />

      {/* The claim that separates us from a supplier: we start with the business,
          not the brief. Sits before the four blocks because it frames them. */}
      <section className="grid gap-x-16 gap-y-8 pb-(--section-y) md:grid-cols-12">
        <Reveal as="h2" className="text-h2 font-light leading-[1.15] tracking-tight md:col-span-5">
          We understand business, not just marketing.
        </Reveal>
        <Reveal delay={120} className="md:col-span-6 md:col-start-7">
          <p className="text-[clamp(1.05rem,1.45vw,1.3rem)] leading-[1.5] text-(--color-ink-soft)">
            Before recommending campaigns, redesigning a brand or creating
            content, we take the time to understand the business, its customers,
            competitors, objectives and where the opportunities are.
          </p>
        </Reveal>
      </section>

      {/* Blocks */}
      <section className="grid gap-x-16 gap-y-16 pb-(--section-y) md:grid-cols-2">
        <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
          {/* On mobile this portrait image is the largest in-fold element (the
              LCP) — preload it too, not just the wide lead image above. */}
          <Figure media={about01} sizes="(min-width: 768px) 46vw, 100vw" rounded priority />
        </div>
        <dl className="flex flex-col">
          {BLOCKS.map((b, i) => (
            <Reveal
              key={b.heading}
              delay={i * 60}
              className="border-t border-(--color-hairline) py-10 first:border-t-0 first:pt-0"
            >
              {b.stat ? (
                <dd className="mb-6 flex items-baseline gap-4">
                  <span className="font-(family-name:--font-label) text-[clamp(3.25rem,7vw,5.5rem)] font-bold leading-none text-(--color-accent)">
                    {b.stat}
                  </span>
                  <span className="eyebrow text-(--color-ink-soft)">{b.statLabel}</span>
                </dd>
              ) : null}
              <dt className="text-h3 font-light tracking-tight">{b.heading}</dt>
              <dd className="mt-4 leading-relaxed text-(--color-ink-soft)">{b.body}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Gallery */}
      <section className="pb-(--section-y)">
        <Reveal as="p" className="eyebrow text-(--color-accent-ink)">
          The setting
        </Reveal>
        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3">
          <Figure media={about03} sizes="(min-width: 768px) 31vw, 100vw" rounded />
          <Figure media={about04} sizes="(min-width: 768px) 31vw, 100vw" rounded />
          <Figure media={about05} sizes="(min-width: 768px) 31vw, 100vw" rounded />
        </div>
      </section>
    </div>
  );
}
