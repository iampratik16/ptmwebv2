import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import WorkGrid from "@/components/work/WorkGrid";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@/components/ui/icons";
import Particles from "@/components/work/Particles";
import { getAllCaseStudies } from "@/content";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected Pink Tree Media case studies. A small number of brands, handled completely, shown as the finished work rather than described.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  const studies = getAllCaseStudies();

  return (
    <div className="relative">
      <Particles />

      <div className="container-page">
        {/* Page header */}
        <header className="pb-[clamp(2rem,5vh,4rem)] pt-[calc(var(--header-h)+clamp(3rem,10vh,8rem))]">
          <Reveal as="p" className="eyebrow">
            Selected work
          </Reveal>
          <MaskHeading
            as="h1"
            className="mt-6 max-w-[16ch] text-display font-light leading-[1.0] tracking-tight"
          >
            Depth over breadth.
          </MaskHeading>
          {/* Deliberately does NOT list the services. That enumeration lives on
              /services, and repeating it here made the two pages read as the
              same page twice. This page is here to be looked at: what the
              standard is, judged on finished work rather than claims. */}
          <Reveal delay={120}>
            <p className="mt-8 max-w-[52ch] text-h3 font-light leading-relaxed text-(--color-ink-soft)">
              A small number of brands, handled completely. Judge us on the
              finished thing.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <TransitionLink
              href="/services"
              className="group mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-(--color-ink) transition-colors duration-500 hover:text-(--color-accent-ink)"
            >
              What we can do
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </TransitionLink>
          </Reveal>
        </header>

        <div className="pb-(--section-y)">
          <WorkGrid studies={studies} />
        </div>
      </div>
    </div>
  );
}
