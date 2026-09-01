"use client";

import { useRef } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import Reveal from "@/components/motion/Reveal";
import { CAPABILITIES } from "@/lib/site";

/**
 * Horizontal services rail: white cards, gold icon rings, oxblood on hover.
 *
 * Scrolling is the native .rail (overflow-x + scroll-snap) — the arrows only
 * nudge scrollLeft, so trackpad, touch and keyboard all keep working if JS
 * never loads. Titles come from CAPABILITIES so the cards cannot drift from
 * what the rest of the site claims we do.
 */

const ICONS: Record<string, React.ReactNode> = {
  "Design & Branding": (
    <>
      <path d="M12 3.5 13.9 9l5.6.3-4.4 3.6 1.5 5.4L12 15.4 7.4 18.3l1.5-5.4L4.5 9.3 10.1 9Z" />
    </>
  ),
  "Print & Merchandise": (
    <>
      <rect x="4.5" y="8.5" width="15" height="8" rx="1.2" />
      <path d="M7.5 8.5v-3h9v3M7.5 16.5v3h9v-3" />
    </>
  ),
  "Websites & Digital": (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="1.6" />
      <path d="M3.5 9.2h17M6.4 7.1h.01M8.6 7.1h.01" />
    </>
  ),
  "Social Media": (
    <>
      <path d="M20 12.4c0 3.9-3.6 7-8 7a9 9 0 0 1-2.6-.4L4.5 20.5l1.2-3.6A6.6 6.6 0 0 1 4 12.4c0-3.9 3.6-7 8-7s8 3.1 8 7Z" />
    </>
  ),
};

const BLURB: Record<string, string> = {
  "Design & Branding":
    "Identity, art direction and brand systems built to hold their value — considered enough to sit in the room with the work they represent.",
  "Print & Merchandise":
    "Stock, finish and production overseen end to end, so the physical pieces feel like the brand rather than an afterthought.",
  "Websites & Digital":
    "Fast, elegant sites designed around the photography and tuned for mobile, with performance treated as part of the design.",
  "Social Media":
    "Art-directed feeds handled as one ongoing lookbook, building recognition between launches instead of chasing volume.",
};

export default function ServicesRail() {
  const railRef = useRef<HTMLUListElement>(null);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Scroll by one card plus its gap, derived from the rendered track so it
    // stays correct across the clamp() breakpoints.
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    // An explicit behavior:"smooth" overrides the computed scroll-behavior, so
    // the reduced-motion rule in globals.css does NOT suppress it. Decide here.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section className="section border-y border-(--color-hairline)">
      <div className="container-page flex items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="eyebrow">
            What we do
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-3 text-h2 font-light tracking-tight"
          >
            Services
          </Reveal>
        </div>

        <div className="hidden shrink-0 gap-3 sm:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => nudge(dir)}
              aria-label={dir === -1 ? "Previous services" : "Next services"}
              className="grid size-12 place-items-center rounded-full border border-(--color-ink)/20 text-(--color-ink) transition-colors duration-500 hover:border-(--color-oxblood) hover:bg-(--color-oxblood) hover:text-(--color-paper-on-dark)"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={dir === -1 ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <ul ref={railRef} className="rail mt-10" aria-label="Services">
        {CAPABILITIES.map((cap, i) => (
          <Reveal key={cap} as="li" delay={i * 80} className="rail-item">
            <TransitionLink href="/work" className="service-card group">
              <span aria-hidden className="service-icon">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[cap]}
                </svg>
              </span>

              <h3 className="mt-8 flex items-center gap-2 text-h3 tracking-tight">
                {cap}
                <svg viewBox="0 0 24 24" className="size-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10 6l6 6-6 6" />
                </svg>
              </h3>

              <p className="service-body mt-4 text-sm leading-relaxed">
                {BLURB[cap]}
              </p>
            </TransitionLink>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
