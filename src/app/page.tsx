import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ShowcaseMosaic from "@/components/sections/ShowcaseMosaic";
import ServicesRail from "@/components/sections/ServicesRail";
import WorkPanels from "@/components/sections/WorkPanels";
import ClientLogos from "@/components/sections/ClientLogos";

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
            Built around your business
          </Reveal>
          <div className="md:col-span-8 md:col-start-5">
            <SplitHeading
              as="p"
              className="font-serif text-h2 font-light leading-[1.15] tracking-tight"
            >
              We work with businesses that want more than individual marketing
              services. We look at the bigger picture, understand the business
              and bring together the right marketing support to help it move
              forward.
            </SplitHeading>
          </div>
        </div>

        <ShowcaseMosaic className="mt-10 lg:mt-14" />
      </section>

      <ServicesRail />

      {/* The argument for the model, sitting between what we do and the proof
          of it. The three sentences are broken explicitly rather than left to
          wrap: they are the whole point of the line, and natural wrapping would
          run them together ("One team. One / strategy. One point / of contact").
          No top border — ServicesRail already closes with border-y. */}
      <section className="section container-page">
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-12">
          <Reveal
            as="h2"
            className="text-h2 font-light leading-[1.15] tracking-tight md:col-span-4"
          >
            One team.
            <br />
            One strategy.
            <br />
            One point of contact.
          </Reveal>
          {/* Wider column AND a larger size together: bumping the type alone
              would have added lines, not removed them, and a ch measure just
              capped the width and put the fourth line back. The column sets the
              measure: 7 of 12 is what holds three lines at this size. */}
          <Reveal delay={120} className="md:col-span-7 md:col-start-6">
            <p className="text-[clamp(1.05rem,1.45vw,1.3rem)] leading-[1.5] text-(--color-ink-soft)">
              Instead of managing different designers, printers, developers and
              marketing companies, we bring everything together. One team that
              understands your business, your brand and where you want to go.
            </p>
          </Reveal>
        </div>
      </section>

      <WorkPanels />

      {/* Ongoing support: the retainer proposition, placed after the proof
          rather than before it — it only means anything once the standard of
          the work has been seen. Centred, deliberately unlike the left/right
          split of the "One team" section above, so the two statement sections
          do not read as the same block twice. */}
      <section className="section container-page text-center">
        <Reveal
          as="h2"
          className="mx-auto max-w-[22ch] text-h2 font-light leading-[1.15] tracking-tight"
        >
          Your ongoing marketing partner.
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-[62ch] text-[clamp(1.05rem,1.45vw,1.3rem)] leading-[1.5] text-(--color-ink-soft)">
            For clients who need ongoing support, we work as an extension of
            their team, helping plan what comes next, managing campaigns and
            keeping every part of their marketing moving in the same direction.
          </p>
        </Reveal>
      </section>

      <ClientLogos />

      {/* Blank band before the footer */}
      <div aria-hidden className="h-[clamp(4rem,8vh,7rem)] bg-(--color-paper)" />
    </>
  );
}
