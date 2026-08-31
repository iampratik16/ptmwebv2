"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";

/**
 * Pins a statement and resolves it word-by-word against scroll progress — the
 * manifesto beat the reference sites open with. Follows the SplitHeading
 * pattern: GSAP is dynamically imported, SplitText is created through
 * `SplitText.create` with `aria: "none"` so no aria-label lands on a <p>, and
 * the raw text stays in the DOM for assistive tech and no-JS.
 *
 * Under reduced motion nothing is imported and nothing pins — the statement is
 * ordinary static text.
 */
export default function PinnedStatement({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Pinning an element taller than the viewport clips it — and below lg the
    // mosaic stacks, so this block gets tall. Desktop only; smaller screens get
    // the same content as ordinary flow, which reads fine.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let revert = () => {};
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger, SplitText }) => {
      if (cancelled) return;
      const target = el.querySelector<HTMLElement>("[data-pin-text]");
      if (!target) return;

      const ctx = gsap.context(() => {
        const split = SplitText.create(target, {
          type: "words",
          aria: "none",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(self.words, { opacity: 0.12 });
            return gsap.to(self.words, {
              opacity: 1,
              ease: "none",
              stagger: 0.4,
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "+=90%",
                pin: true,
                // Pin by margin rather than wrapping: the section is a direct
                // child of a flow layout and a wrapper would break the
                // surrounding rhythm.
                pinSpacing: true,
                scrub: 0.6,
              },
            });
          },
        });
        return () => split.revert();
      }, el);

      revert = () => ctx.revert();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
