import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Sectors from "@/components/sections/Sectors";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ShowcaseMosaic from "@/components/sections/ShowcaseMosaic";
import ServicesRail from "@/components/sections/ServicesRail";
import WorkCardsGrid from "@/components/sections/WorkCardsGrid";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
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

      <ServicesRail />

      <WorkCardsGrid />

      {/* Blank band before the footer */}
      <div aria-hidden className="h-[clamp(4rem,8vh,7rem)] bg-(--color-paper)" />
    </>
  );
}
