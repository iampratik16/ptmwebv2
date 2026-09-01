import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@/components/ui/icons";
import { getAllCaseStudies } from "@/content";

/**
 * Sector rail. Every reference site segments by sector; ours is derived from
 * the `sector` field already on each case study, so it can never drift from
 * the work on display.
 *
 * Grouping is by exact string. "Hospitality" and "Luxury Events & Hospitality"
 * are deliberately NOT merged — whether they are one sector or two is a client
 * content decision, not something to paper over in a groupBy. See
 * CONTENT-TODO.md.
 */
export default function Sectors() {
  const bySector = new Map<string, string[]>();
  for (const cs of getAllCaseStudies()) {
    bySector.set(cs.sector, [...(bySector.get(cs.sector) ?? []), cs.client]);
  }
  const sectors = [...bySector.entries()];

  return (
    <section className="section border-y border-(--color-hairline)">
      <div className="container-page">
        {/* h2, not p: the rail items are h3, and without an h2 here the page
            jumped h1 -> h3. Visually identical via .eyebrow. */}
        <Reveal as="h2" className="eyebrow">
          Sectors
        </Reveal>
      </div>

      <ul className="rail mt-10" aria-label="Sectors we work in">
        {sectors.map(([sector, clients], i) => (
          <Reveal key={sector} as="li" delay={i * 90} className="rail-item">
            <TransitionLink href="/work" className="group block">
              <span
                aria-hidden
                className="block font-(family-name:--font-label) text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none text-(--color-accent)"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-h3 transition-colors duration-500 group-hover:text-(--color-accent-ink)">
                {sector}
              </h3>
              <p className="mt-2 text-sm text-(--color-ink-soft)">
                {clients.join(" · ")}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-(--color-ink-soft) transition-colors duration-500 group-hover:text-(--color-accent-ink)">
                View work
                <ArrowUpRight className="size-3.5" />
              </span>
            </TransitionLink>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
