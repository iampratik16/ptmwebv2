import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Sectors from "@/components/sections/Sectors";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ShowcaseMosaic from "@/components/sections/ShowcaseMosaic";
import ServicesRail from "@/components/sections/ServicesRail";
import WorkCard from "@/components/work/WorkCard";
import TransitionLink from "@/components/ui/TransitionLink";
import { getAllCaseStudies } from "@/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <>
      <Hero />

      {/* Manifesto + showcase. Deliberately NOT pinned: pinning held the
          viewport for 810px of scroll, which reads as the page being stuck.
          SplitHeading gives the same line reveal without freezing scrolling. */}
      <section className="section container-page">
        <div className="grid gap-y-10 md:grid-cols-12">
          <Reveal as="p" className="eyebrow md:col-span-3">
            Who we are
          </Reveal>
          <div className="md:col-span-8 md:col-start-5">
            <SplitHeading
              as="p"
              className="font-serif text-h2 font-light leading-[1.15] tracking-tight"
            >
              A luxury creative consultancy handling every aspect of a brand’s
              marketing under one roof, quietly, and exceptionally well.
            </SplitHeading>
          </div>
        </div>

        <ShowcaseMosaic className="mt-10 lg:mt-14" />
      </section>

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

      <ServicesRail />

      {/* Blank band before the footer */}
      <div aria-hidden className="h-[clamp(4rem,8vh,7rem)] bg-(--color-paper)" />
    </>
  );
}
