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
    "Branding and design, print and merchandise, social media marketing, websites and digital marketing. Everything a business needs to market itself, handled by one team.",
  alternates: { canonical: "/services" },
};

/**
 * Services answers "what can you do for us, and what do I actually receive".
 * Work answers "is it any good". Keeping those jobs separate is what stops the
 * two pages reading as the same page twice: the art here is abstract still-life,
 * never client work, and the page is read rather than browsed.
 *
 * `groups` rather than a flat list because Websites & Digital Marketing is two
 * offers under one heading, and they are worth naming separately. Every group
 * declares `label` — null where it has no sub-heading — because with `as const`
 * an omitted key leaves the property off the union entirely and `group.label`
 * stops type-checking.
 */
const SERVICES = [
  {
    slug: "brand-design",
    art: "brand-design",
    name: "Branding & Design",
    lead: "Build a brand with direction, consistency and purpose.",
    body: "The work that decides how a business is recognised, and whether it looks like it belongs in the room it is competing in.",
    groups: [
      {
        label: null,
        items: [
          "Brand Strategy",
          "Logo & Identity",
          "Brand Guidelines",
          "Graphic Design",
          "Marketing Collateral",
          "Campaign Creative",
          "Packaging",
          "Art Direction",
        ],
      },
    ],
    alt: "An open type specimen booklet, an embossed monogram card and blush colour chips on cream marble.",
  },
  {
    slug: "print-merchandise",
    art: "print-merchandise",
    name: "Print & Merchandise",
    lead: "From everyday print to something people keep.",
    body: "Print has been part of Pink Tree Media from the beginning, so we understand the production side as well as the design side: stock, finishes, lead times and what will actually come off the press looking the way it did on screen.",
    groups: [
      {
        label: null,
        items: [
          "Business Print",
          "Brochures",
          "Packaging",
          "Signage",
          "Large Format",
          "Event Print",
          "Promotional Products",
          "Clothing",
          "Corporate Merchandise",
          "Bespoke Products",
        ],
      },
    ],
    alt: "Letterpress sheets, a gold-edged gift box lined in oxblood tissue and a folded canvas tote on cream marble.",
  },
  {
    slug: "social-media-marketing",
    art: "social-media-marketing",
    name: "Social Media Marketing",
    lead: "Strategy before posting.",
    body: "Social media should support the business, not simply keep the feed active. We develop the strategy, plan the content, manage production and publishing, and continually review what’s working.",
    groups: [
      {
        label: null,
        items: [
          "Strategy & Planning",
          "Content Calendars",
          "Content Creation",
          "Photography & Video",
          "Reels",
          "Copywriting",
          "Community Management",
          "Influencer Collaborations",
          "Paid Social",
          "Reporting",
        ],
      },
    ],
    alt: "Square matte photographic prints in warm colour fields, arranged in an overlapping grid on cream marble.",
  },
  {
    slug: "websites-digital",
    art: "websites",
    name: "Websites & Digital Marketing",
    lead: "Your digital presence should do more than look good.",
    body: "We create websites and digital campaigns around clear business objectives, whether that’s generating enquiries, increasing bookings, selling products or strengthening your online presence.",
    groups: [
      {
        label: "Websites",
        items: [
          "Website Strategy",
          "UX/UI",
          "Development",
          "E-commerce",
          "Landing Pages",
          "Hosting & Maintenance",
        ],
      },
      {
        label: "Digital Marketing",
        items: [
          "SEO",
          "Google Ads",
          "Paid Social",
          "Email Marketing",
          "Remarketing",
          "Analytics & Campaign Management",
        ],
      },
    ],
    alt: "A slab of clear glass on a marble base refracting a prism caustic across a plaster wall.",
  },
] as const;

/** The engagement itself. Nothing here is showable in a portfolio, which is
 *  exactly why it belongs on this page and not on Work.
 *
 *  The fourth step is "Grow", not "Handover", on purpose: a handover is the end
 *  of a project, and this page is selling an ongoing relationship. The cycle
 *  closes back onto itself rather than stopping. */
const PROCESS = [
  {
    step: "Understand",
    body: "We learn about the business, customers, objectives and current marketing.",
  },
  {
    step: "Strategise",
    body: "We identify the opportunities and agree where our time and the client’s budget will have the most impact.",
  },
  {
    step: "Deliver",
    body: "Our team handles the strategy, creative, production and implementation.",
  },
  {
    step: "Grow",
    body: "We review what’s working, identify what’s next and continue improving.",
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
            className="max-w-[24ch] text-h1 font-light leading-[1.05] tracking-tight"
          >
            Everything your business needs to market itself, in one place.
          </MaskHeading>
          <Reveal delay={140}>
            <p className="mt-8 max-w-[62ch] text-(--color-ink-soft)">
              You don’t need to know which marketing service you need before
              speaking to us. Tell us about the business, where you are now and
              where you want to go. We’ll help work out what comes next.
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
              media={img(`/media/services/page/${service.art}.jpg`, service.alt, 896, 1152)}
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

            {service.groups.map((group, g) => (
              <Reveal key={group.label ?? "all"} delay={210 + g * 60}>
                <p className="eyebrow mt-9 text-(--color-ink-soft)">
                  {group.label ?? "What you get"}
                </p>
                <ul className="mt-4 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
                  {group.items.map((item) => (
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
            ))}
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
            One project or all four. The first conversation is the same either
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
