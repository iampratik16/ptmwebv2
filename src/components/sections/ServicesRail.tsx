"use client";

import { useRef } from "react";
import Img from "@/components/media/Img";
import Reveal from "@/components/motion/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { img } from "@/lib/media";
import { CAPABILITIES } from "@/lib/site";

/**
 * Services as full-bleed photographic panels — the same .work-panel treatment
 * as Selected work, so the two rails read as one system rather than two ideas.
 *
 * Scrolling is still the native .rail (overflow-x); the arrows only nudge
 * scrollLeft, so trackpad, touch and keyboard all keep working if JS never
 * loads. Titles come from CAPABILITIES so the panels cannot drift from what the
 * rest of the site claims we do.
 *
 * The header band stays on paper rather than going ink like Selected work's:
 * Services sits directly above Selected work, and two ink bands in a row merge
 * into one dark stretch with no rhythm between them. The panels carry the dark.
 */

// Explicit capability -> art map, for the same reason WorkPanels keeps one:
// deriving a filename from the label silently turns "Print & Merchandise" into
// something like "print-merchandise" only until a label gains punctuation, and
// then it 404s quietly. An explicit map fails visibly instead.
const PANEL_ART: Record<string, string> = {
  "Design & Branding": "design-branding",
  "Print & Merchandise": "print-merchandise",
  "Websites & Digital": "websites-digital",
  "Social Media": "social-media",
};

// The blurb each card used to carry, cut to the length the panel can hold. The
// full sentences live on in the capability pages; a panel has room for a label,
// not a paragraph.
const TAG: Record<string, string> = {
  "Design & Branding": "Identity & art direction",
  "Print & Merchandise": "Stock, finish & production",
  "Websites & Digital": "Fast, elegant, mobile-first",
  "Social Media": "Art-directed feeds",
};

export default function ServicesRail() {
  const railRef = useRef<HTMLUListElement>(null);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Scroll by one panel, derived from the rendered track so it stays correct
    // across the clamp() breakpoints. The flush rail has no gap to add.
    const panel = el.querySelector("li");
    const step = panel ? panel.getBoundingClientRect().width : el.clientWidth * 0.8;
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

      <ul ref={railRef} className="rail rail--flush mt-10" aria-label="Services">
        {CAPABILITIES.map((cap, i) => (
          <Reveal media key={cap} as="li" delay={i * 80} className="rail-item">
            <TransitionLink href="/work" className="work-panel work-panel--square group">
              {/* alt is empty on purpose: the image is inside the link, so its
                  alt folds into the link's accessible name, and the link already
                  renders the service name / "View" / tag as real text.
                  sizes mirrors the clamp(15rem, 26vw, 24rem) track. */}
              <Img
                media={img(`/media/services/${PANEL_ART[cap]}.jpg`, "", 1024, 1024)}
                fill
                sizes="(min-width: 1477px) 384px, (min-width: 1024px) 26vw, 72vw"
                className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />

              <span aria-hidden className="work-panel__scrim" />

              {/* Numeral up the left edge, where the work panels set their
                  disciplines. */}
              <span aria-hidden className="work-panel__vertical">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="work-panel__inner">
                <span className="work-panel__name">{cap}</span>
                <span aria-hidden className="work-panel__rule" />
                <span className="work-panel__view">View</span>
                <span aria-hidden className="work-panel__rule" />
                <span className="work-panel__sector">{TAG[cap]}</span>
              </span>
            </TransitionLink>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
