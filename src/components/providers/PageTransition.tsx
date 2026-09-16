"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Navigate = (href: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

/** Hook used by TransitionLink to trigger a covered route change. */
export function useTransitionNavigate(): Navigate {
  const ctx = useContext(TransitionContext);
  // Fallback to a hard navigation if the provider is somehow absent.
  return ctx ?? ((href: string) => { window.location.href = href; });
}

// Measured, not guessed. At 400/460 a navigation cost ~930ms end to end on the
// production build; at 190/240 it was ~490ms — and in that 490ms the URL already
// changed at ~236ms, so what remained was still almost entirely this animation
// rather than any loading. Cut again to 110/150. That is ~330ms total: fast
// enough to read as a page change rather than a wait, while still covering the
// swap so there is no white flash. Must match the CSS transition durations on
// .page-curtain[data-phase] in globals.css.
const COVER_MS = 110;
const REVEAL_MS = 150;

/**
 * Cinematic cover/wipe between routes — no white flash. A warm panel sweeps up
 * to cover the viewport, the route swaps underneath, then the panel wipes away
 * revealing the new page. Under reduced motion it falls back to an instant push.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const targetRef = useRef<string | null>(null);
  const firstRender = useRef(true);

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === pathname) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }
      // Warm the route NOW, so the fetch overlaps the cover animation instead of
      // queueing behind it. Without this the push below starts from cold at
      // COVER_MS, and the curtain hides a network round trip it could have spent.
      router.prefetch(href);
      targetRef.current = href;
      setPhase("cover");
    },
    [pathname, router],
  );

  // When the cover finishes, perform the actual route change.
  useEffect(() => {
    if (phase !== "cover" || !targetRef.current) return;
    const id = window.setTimeout(() => {
      if (targetRef.current) router.push(targetRef.current);
    }, COVER_MS);
    return () => window.clearTimeout(id);
  }, [phase, router]);

  // Once the new route's pathname is live (we were covering), reveal it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (targetRef.current) {
      targetRef.current = null;
      setPhase("reveal");
      const id = window.setTimeout(() => setPhase("idle"), REVEAL_MS);
      return () => window.clearTimeout(id);
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div aria-hidden data-phase={phase} className="page-curtain">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/mark.png"
          alt=""
          width={64}
          height={64}
          className="page-curtain__mark h-16 w-auto"
        />
      </div>
    </TransitionContext.Provider>
  );
}
