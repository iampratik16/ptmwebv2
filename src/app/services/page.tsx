import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import Figure from "@/components/media/Figure";
import Button from "@/components/ui/Button";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@/components/ui/icons";
import { img } from "@/lib/media";

export const metadata: Metadata = {
  title: "Services",
  description:
    "What Pink Tree Media does and what you get: brand and design, print and merchandise, social media marketing, websites and digital marketing, with the deliverables spelled out.",
  alternates: { canonical: "/services" },
};

/**
 * Services answers "what can you do for us, and what do I actually receive".
 * Work answers "is it any good". Keeping those jobs separate is what stops the
 * two pages reading as the same page twice:
 *
 *   Services  explanatory. Deliverables, scope and process, in words. The art
 *             is abstract still-life, never client work, so it never competes
 *             with the portfolio.
 *   Work      evidence. Real client photography at full bleed, almost no copy,
 *             and it does not enumerate the service list.
 *
 * Each row therefore carries the thing a portfolio can never show: the actual
 * list of what lands on the client's desk. See /work/page.tsx for the other half.
 */
const SERVICES = [
  {
    slug: "brand-design",
    name: "Brand & Design",
    lead: "Identity, art direction and the systems that hold them together.",
    body: "Most brands arrive with some of this already in place. We work out what is worth keeping, rebuild the rest, and write down the rules so it survives contact with everyone who uses it after us.",
    includes: [
      "Logo, wordmark and marque",
      "Colour and typography systems",
      "Art direction and image treatment",
      "Brand guidelines",
      "Templates for print and social",
    ],
    alt: "An open type specimen booklet, an embossed monogram card and blush colour chips on cream marble.",
  },
  {
    slug: "print-merchandise",
    name: "Print & Merchandise",
    lead: "Physical pieces that feel like the brand rather than an afterthought.",
    body: "Stock, finish and production overseen end to end. We proof before anything runs, and we deal with the printers directly, so the difference between the file and the finished piece is our problem rather than yours.",
    includes: [
      "Stationery and collateral",
      "Brochures, menus and lookbooks",
      "Packaging and finishing",
      "Signage and large format",
      "Branded merchandise",
      "Print management and proofing",
    ],
    alt: "Letterpress sheets, a gold-edged gift box lined in oxblood tissue and a folded canvas tote on cream marble.",
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    lead: "Feeds art-directed as one ongoing lookbook.",
    body: "Planned in advance rather than posted in a hurry, so the account builds recognition between launches. The grid is treated as a single composition, because that is how anyone landing on the profile sees it.",
    includes: [
      "Content planning and calendars",
      "Photography and art direction",
      "Copywriting and captions",
      "Scheduling and publishing",
      "Monthly reporting",
    ],
    alt: "Square matte photographic prints in warm colour fields, arranged in an overlapping grid on cream marble.",
  },
  {
    slug: "websites",
    name: "Websites",
    lead: "Fast, elegant sites designed around the photography.",
    body: "Designed mobile first and measured on real load times, not on how it looks on the studio monitor. Performance and accessibility are part of the build rather than a report someone sends afterwards.",
    includes: [
      "Design and build",
      "Copy and photography direction",
      "CMS setup and training",
      "Performance and accessibility",
      "Launch and aftercare",
    ],
    alt: "A slab of clear glass on a marble base refracting a prism caustic across a plaster wall.",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    lead: "Reaching the right people, and knowing that it worked.",
    body: "Planned around what the brand actually needs to sell, then reported in plain numbers you can act on. If something is not returning, we would rather tell you early than keep it running quietly.",
    includes: [
      "Paid social campaigns",
      "Search, paid and organic",
      "Email campaigns",
      "Campaign landing pages",
      "Tracking and reporting",
    ],
    alt: "Amber and blush acrylic sheets standing in a staggered row, light deepening through each layer.",
  },
] as const;

/** The engagement itself. Nothing here is showable in a portfolio, which is
 *  exactly why it belongs on this page and not on Work. */
const PROCESS = [
  {
    step: "Conversation",
    body: "What the brand needs, what is already working, and what the budget genuinely is. No proposal until we understand all three.",
  },
  {
    step: "Direction",
    body: "Routes to look at before anything goes into production, so the decisions happen while they are still cheap to change.",
  },
  {
    step: "Production",
    body: "The work made, proofed and checked. One point of contact throughout, not a rotating cast.",
  },
  {
    step: "Handover",
    body: "Files, guidelines and the templates to keep using it. We stay reachable after launch rather than closing the file.",
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="container-page">
      <header className="grid gap-y-10 pb-[clamp(3rem,8vh,6rem)] pt-[calc(var(--header-h)+clamp(3rem,10vh,8rem))] md:grid-cols-12">
        <Reveal as="p" className="eyebrow md:col-span-3">
          Services
        </Reveal>
        <div className="md:col-span-9">
          <MaskHeading
            as="h1"
            className="max-w-[20ch] text-h1 font-light leading-[1.05] tracking-tight"
          >
            Everything a brand needs, in one place.
          </MaskHeading>
          <Reveal delay={140}>
            <p className="mt-8 max-w-[58ch] text-(--color-ink-soft)">
              Five services that work as one. Below is what each involves and
              what you actually receive. If you would rather judge the standard
              than read about it, the work speaks for itself.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <TransitionLink
              href="/work"
              className="group mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-(--color-ink) transition-colors duration-500 hover:text-(--color-accent-ink)"
            >
              See selected work
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </TransitionLink>
          </Reveal>
        </div>
      </header>

      {SERVICES.map((service, i) => (
        <section
          key={service.slug}
          className="grid items-start gap-x-14 gap-y-10 border-t border-(--color-hairline) py-(--section-y) md:grid-cols-12"
        >
          {/* The image is deliberately the SMALLER column here (4 of 12, against
              Work's full-bleed panels). This page is read, not browsed. */}
          <div
            className={`md:col-span-4 ${i % 2 === 1 ? "md:order-2 md:col-start-9" : ""}`}
          >
            <Figure
              media={img(
                `/media/services/page/${service.slug}.jpg`,
                service.alt,
                896,
                1152,
              )}
              sizes="(min-width: 768px) 32vw, 100vw"
              rounded
              priority={i === 0}
            />
          </div>

          <div
            className={`md:col-span-7 ${
              i % 2 === 1 ? "md:col-start-1 md:row-start-1" : "md:col-start-6"
            }`}
          >
            <Reveal as="p" className="eyebrow text-(--color-accent-ink)">
              {String(i + 1).padStart(2, "0")}
            </Reveal>
            <Reveal as="h2" delay={60} className="mt-4 text-h2 font-light tracking-tight">
              {service.name}
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-5 max-w-[46ch] font-serif text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.45]">
                {service.lead}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 max-w-[54ch] text-(--color-ink-soft)">{service.body}</p>
            </Reveal>

            <Reveal delay={210}>
              <p className="eyebrow mt-9 text-(--color-ink-soft)">What you get</p>
              <ul className="mt-4 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-sm text-(--color-ink)"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-(--color-accent)"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ))}

      {/* How we work: the part of the offer a portfolio cannot demonstrate. */}
      <section className="border-t border-(--color-hairline) py-(--section-y)">
        <Reveal as="p" className="eyebrow">
          How we work
        </Reveal>
        <Reveal as="h2" delay={70} className="mt-3 max-w-[24ch] text-h2 font-light tracking-tight">
          Four steps, and one person to speak to.
        </Reveal>
        <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((phase, i) => (
            <Reveal as="li" key={phase.step} delay={i * 80}>
              <span
                aria-hidden
                className="block font-(family-name:--font-label) text-[clamp(2rem,3.4vw,2.75rem)] font-bold leading-none text-(--color-accent)"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-h3 tracking-tight">{phase.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-(--color-ink-soft)">
                {phase.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-t border-(--color-hairline) py-(--section-y) text-center">
        <Reveal as="h2" className="mx-auto max-w-[18ch] text-h2 font-light tracking-tight">
          Tell us what you need.
        </Reveal>
        <Reveal delay={90}>
          <p className="mx-auto mt-5 max-w-[48ch] text-(--color-ink-soft)">
            One project or all five. The first conversation is the same either
            way.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-9 flex justify-center">
            <Button href="/contact" variant="solid" withArrow>
              Get in touch
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
