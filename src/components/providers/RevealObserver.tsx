"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Single IntersectionObserver that plays every `[data-reveal]` /
 * `[data-reveal-media]` element once as it scrolls into view (adds `.is-in`).
 * Re-scans on route change. The reveal styling lives in globals.css and is
 * gated behind `html.js`, so content is fully visible if this never runs.
 *
 * Honours an optional `data-reveal-delay` (ms) for staggered groups.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-media]"),
    ).filter((el) => !el.classList.contains("is-in"));

    if (reduced) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const reveal = (el: HTMLElement) => {
      const delay = Number(el.dataset.revealDelay ?? 0);
      if (delay) {
        window.setTimeout(() => el.classList.add("is-in"), delay);
      } else {
        el.classList.add("is-in");
      }
    };

    // Items in a horizontal rail enter the viewport SIDEWAYS. Observed one by
    // one, each fires its 28px rise (or clip-path wipe) mid-swipe, so the rail
    // lurches upward under your finger — what read as "horizontal scrolling
    // isn't stable". Group them by rail and let the rail's own arrival trigger
    // the whole set, stagger intact: by the time you swipe sideways, every card
    // has already settled.
    const groups = new Map<Element, HTMLElement[]>();
    const solo: HTMLElement[] = [];
    for (const el of targets) {
      const rail = el.closest(".rail");
      if (rail) groups.set(rail, [...(groups.get(rail) ?? []), el]);
      else solo.push(el);
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const group = groups.get(entry.target);
          if (group) group.forEach(reveal);
          else reveal(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    solo.forEach((el) => io.observe(el));
    groups.forEach((_, rail) => io.observe(rail));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
