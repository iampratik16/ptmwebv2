import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import Figure from "@/components/media/Figure";
import Button from "@/components/ui/Button";
import { img } from "@/lib/media";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand and design, print and merchandise, social media marketing, websites and digital marketing — every part of a brand's marketing handled under one roof.",
  alternates: { canonical: "/services" },
};

/**
 * Services: five alternating rows, image one side, a short paragraph the other.
 *
 * Kept deliberately light on copy — a service page earns its keep by being
 * scannable, and the detail belongs in a conversation, not on the page. Each
 * row is one image, one sentence of what it is, one of how we work.
 *
 * Note these five are the client-facing service names and are NOT the same list
 * as CAPABILITIES / DISCIPLINES in src/lib/site.ts, which are wired to case
 * study content and its zod enum. Aligning the two means a content migration,
 * so they are deliberately left separate rather than half-merged.
 */
const SERVICES = [
  {
    slug: "brand-design",
    name: "Brand & Design",
    lead: "Identity, art direction and the systems that hold them together.",
    body: "Logos, palettes, typography and the rules that keep them consistent wherever the brand appears — considered enough to sit in the room with the work they represent.",
    alt: "An open type specimen booklet, an embossed monogram card and blush colour chips on cream marble.",
  },
  {
    slug: "print-merchandise",
    name: "Print & Merchandise",
    lead: "Physical pieces that feel like the brand rather than an afterthought.",
    body: "Stationery, brochures, packaging, signage and branded merchandise — stock, finish and production overseen end to end, with proofs checked before anything goes to press.",
    alt: "Letterpress sheets, a gold-edged gift box lined in oxblood tissue and a folded canvas tote on cream marble.",
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    lead: "Feeds art-directed as one ongoing lookbook.",
    body: "Content planning, photography direction, copy and scheduling handled together, so the account builds recognition between launches instead of chasing volume.",
    alt: "Square matte photographic prints in warm colour fields, arranged in an overlapping grid on cream marble.",
  },
  {
    slug: "websites",
    name: "Websites",
    lead: "Fast, elegant sites designed around the photography.",
    body: "Design, build and launch, tuned for mobile first and measured on real load times — performance treated as part of the design rather than something bolted on afterwards.",
    alt: "A slab of clear glass on a marble base refracting a prism caustic across a plaster wall.",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    lead: "Reaching the right people, and knowing that it worked.",
    body: "Paid social, search, email and campaign landing pages, planned around what the brand actually needs to sell and reported in plain numbers you can act on.",
    alt: "Amber and blush acrylic sheets standing in a staggered row, light deepening through each layer.",
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
            Every part of it, handled under one roof.
          </MaskHeading>
          <Reveal delay={140}>
            <p className="mt-8 max-w-[58ch] text-(--color-ink-soft)">
              Five services that work as one. Most brands come to us for a single
              piece and stay for the rest, because the parts are designed
              together rather than commissioned separately.
            </p>
          </Reveal>
        </div>
      </header>

      {SERVICES.map((service, i) => (
        <section
          key={service.slug}
          className="grid items-center gap-x-16 gap-y-8 border-t border-(--color-hairline) py-(--section-y) md:grid-cols-12"
        >
          {/* Alternate the image side on wider screens; on mobile the image
              always leads, so the page reads image-then-copy the whole way
              down rather than flipping order mid-scroll. */}
          <div
            className={`md:col-span-5 ${
              i % 2 === 1 ? "md:order-2 md:col-start-8" : ""
            }`}
          >
            <Figure
              media={img(
                `/media/services/page/${service.slug}.jpg`,
                service.alt,
                896,
                1152,
              )}
              sizes="(min-width: 768px) 40vw, 100vw"
              rounded
              priority={i === 0}
            />
          </div>

          <div className={`md:col-span-6 ${i % 2 === 1 ? "md:col-start-1 md:row-start-1" : "md:col-start-7"}`}>
            <Reveal as="p" className="eyebrow text-(--color-accent-ink)">
              {String(i + 1).padStart(2, "0")}
            </Reveal>
            <Reveal as="h2" delay={60} className="mt-4 text-h2 font-light tracking-tight">
              {service.name}
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-[46ch] font-serif text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.45]">
                {service.lead}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-4 max-w-[52ch] text-(--color-ink-soft)">{service.body}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="border-t border-(--color-hairline) py-(--section-y) text-center">
        <Reveal as="h2" className="mx-auto max-w-[18ch] text-h2 font-light tracking-tight">
          Tell us what you need.
        </Reveal>
        <Reveal delay={90}>
          <p className="mx-auto mt-5 max-w-[48ch] text-(--color-ink-soft)">
            One project or all five — the first conversation is the same either
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
