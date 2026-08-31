import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Sectors from "@/components/sections/Sectors";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import PinnedStatement from "@/components/motion/PinnedStatement";
import ShowcaseMosaic from "@/components/sections/ShowcaseMosaic";
import WorkCard from "@/components/work/WorkCard";
import HoverVideo from "@/components/media/HoverVideo";
import HyperspeedBg from "@/components/media/HyperspeedBg";
import TiltedCard from "@/components/media/TiltedCard";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@/components/ui/icons";
import { getAllCaseStudies } from "@/content";
import { loop } from "@/lib/media";
import { CAPABILITIES } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// AI-generated stand-in imagery for the capability cards, each plays an ambient
// video on hover (poster = the still). See CONTENT-TODO.md.
const CAP_MEDIA = [
  loop("/media/capabilities/01", "/media/capabilities/01.jpg", "An embossed luxury branding suite with a wax seal and colour swatches", 1200, 1600),
  loop("/media/capabilities/02", "/media/capabilities/02.jpg", "A stack of foil-embossed print collateral beside a cotton tote", 1200, 1600),
  loop("/media/capabilities/03", "/media/capabilities/03.jpg", "A minimal website shown on a laptop and phone on a marble desk", 1200, 1600),
  loop("/media/capabilities/04", "/media/capabilities/04.jpg", "An editorial social-content flat lay of printed photo tiles and florals", 1200, 1600),
];

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <>
      <Hero />

      {/* Manifesto — pins and resolves word by word against scroll progress,
          with the showcase mosaic as its cargo. The pin holds for ~810px; with
          only the 119px statement in it that was dead scroll, so the mosaic
          resolves beneath the statement while it is held.
          SplitHeading is deliberately not used here: PinnedStatement runs its
          own SplitText, and two splits on one node fight over the DOM. */}
      <PinnedStatement className="section container-page">
        <div className="grid gap-y-10 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">Who we are</p>
          <div className="md:col-span-8 md:col-start-5">
            <p
              data-pin-text
              className="font-serif text-h2 font-light leading-[1.15] tracking-tight"
            >
              A luxury creative consultancy handling every aspect of a brand&rsquo;s
              marketing under one roof, quietly, and exceptionally well.
            </p>
          </div>
        </div>

        <ShowcaseMosaic className="mt-8 lg:mt-10 lg:h-[54vh]" />
      </PinnedStatement>

      <Sectors />

      {/* Selected work — sticky stack: each card pins under the header and the
          next scrolls over it. Cards carry an opaque ground so the one beneath
          is fully covered. */}
      <section className="section container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal as="p" className="eyebrow">
              Selected work
            </Reveal>
            <SplitHeading as="h2" className="mt-3 text-h2 font-light tracking-tight">
              Proof, not promises.
            </SplitHeading>
          </div>
          <TransitionLink
            href="/work"
            className="link-underline hidden shrink-0 pb-2 text-sm uppercase tracking-[0.12em] text-(--color-ink-soft) hover:text-(--color-accent-ink) sm:inline-block"
          >
            All work
          </TransitionLink>
        </div>

        <div className="sticky-stack mt-10 flex flex-col gap-[12vh]">
          {studies.map((study, i) => (
            <div
              key={study.slug}
              className="sticky-stack-item bg-(--color-paper) pb-6"
            >
              <WorkCard
                study={study}
                index={i + 1}
                ratio="16 / 9"
                sizes="(min-width: 1024px) 70vw, 100vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* What we do, staggered capability cards with ghost numbers + hover */}
      <section className="border-y border-(--color-hairline)">
        <div className="container-page section">
          <Reveal as="p" className="eyebrow">
            What we do
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {CAPABILITIES.map((cap, i) => (
              <Reveal
                media
                key={cap}
                as="li"
                delay={i * 110}
                className={`cap-card group ${i % 2 === 1 ? "lg:mt-20" : ""}`}
              >
                <TransitionLink href="/work" className="block">
                  <span
                    aria-hidden
                    className="cap-card-num block text-[clamp(3.5rem,7vw,5.5rem)] tracking-tight"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative -mt-5 aspect-[4/5]">
                    <TiltedCard rotateAmplitude={12} scaleOnHover={1.08}>
                      <HoverVideo
                        media={CAP_MEDIA[i]}
                        sizes="(min-width: 1024px) 22vw, 45vw"
                      />
                    </TiltedCard>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="text-h3 tracking-tight transition-colors duration-500 group-hover:text-(--color-accent-ink)">
                      {cap}
                    </h3>
                    <span className="cap-card-arrow grid size-10 shrink-0 place-items-center rounded-full border border-(--color-ink)/25 text-(--color-ink)">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </TransitionLink>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach teaser, Hyperspeed highway background */}
      <section className="section pb-[clamp(1.5rem,3vh,3rem)] relative isolate overflow-hidden bg-(--color-oxblood) text-(--color-paper-on-dark)">
        <HyperspeedBg />
        {/* Scrim: darkest under the statement (right), lets the streaks breathe
            on the left, so the copy stays legible over the moving lights. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-l from-(--color-oxblood)/85 via-(--color-oxblood)/45 to-(--color-oxblood)/60"
        />
        <div className="container-page relative z-10 grid gap-y-10 md:grid-cols-12">
          <Reveal
            as="p"
            className="eyebrow text-(--color-paper-on-dark)/80 [text-shadow:0_1px_12px_rgba(20,17,15,0.8)] md:col-span-3"
          >
            Our approach
          </Reveal>
          <div className="md:col-span-8 md:col-start-5">
            <SplitHeading
              as="p"
              className="font-serif text-h2 font-light leading-[1.18] tracking-tight [text-shadow:0_2px_24px_rgba(20,17,15,0.7)]"
            >
              We don’t chase volume. We partner with a small number of ambitious
              brands, for the long term, and treat their reputation as our own.
            </SplitHeading>
            <Reveal delay={120}>
              <TransitionLink
                href="/about"
                className="link-underline mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-(--color-accent-on-dark) hover:text-(--color-paper-on-dark)"
              >
                More about us
                <ArrowUpRight className="size-4" />
              </TransitionLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Blank band separating the dark approach section from the light footer */}
      <div aria-hidden className="h-[clamp(4rem,8vh,7rem)] bg-(--color-paper)" />
    </>
  );
}
