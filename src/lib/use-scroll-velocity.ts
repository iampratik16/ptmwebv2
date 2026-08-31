"use client";

import { useEffect, useState } from "react";

/**
 * Clamped -1…1 scroll-velocity signal for lean/skew effects.
 *
 * Reads Lenis's own `velocity` rather than recomputing scroll deltas — Lenis
 * already tracks it every frame, and it is only mounted when motion is allowed.
 * When Lenis is absent (reduced motion, or before the deferred idle mount) this
 * stays 0, which is exactly the right value in both cases.
 */
export function useScrollVelocity(): number {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let current = 0;

    const tick = () => {
      // Lenis velocity is px/frame-ish; 40 maps a brisk flick to roughly 1.
      const target = Math.max(-1, Math.min(1, (window.__lenis?.velocity ?? 0) / 40));
      current += (target - current) * 0.12;
      if (Math.abs(current) < 0.001) current = 0;
      setV(current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return v;
}
