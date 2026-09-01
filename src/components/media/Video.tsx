"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { getBlur } from "@/lib/media";
import type { VideoMedia } from "@/content/schema";

type Props = {
  media: VideoMedia;
  className?: string;
  /** Eager-load immediately (e.g. above-the-fold hero) instead of on approach. */
  eager?: boolean;
  sizes?: string;
  /** Fill the positioned parent instead of holding the media aspect ratio. */
  fill?: boolean;
};

/**
 * Ambient video loop. The poster paints instantly; the muted/looping video
 * lazy-mounts as it nears the viewport and pauses when off-screen. Honours
 * `prefers-reduced-motion` and the Save-Data hint (poster only). The `mux`
 * provider branch is where a <MuxPlayer> drops in for longer clips — no
 * refactor of consumers required.
 */
export default function Video({
  media,
  className = "",
  eager = false,
  sizes = "100vw",
  fill = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const blur = getBlur(media.poster);

  // iOS only autoplays a clip that is genuinely muted and inline, and refuses
  // outright in Low Power Mode. So force `muted` on the element rather than
  // trusting the prop, and if the policy still says no, retry once on the first
  // user gesture — otherwise the hero sits frozen on its poster all session.
  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {
      const retry = () => void el.play().catch(() => {});
      document.addEventListener("touchstart", retry, { once: true, passive: true });
      document.addEventListener("click", retry, { once: true });
    });
  }, []);

  // Decide whether to ever play video. Poster only under reduced motion,
  // Save-Data, an explicit slow-connection hint, or when a Mux source hasn't
  // been wired up yet.
  //
  // Phones are NOT poster-only any more. The loop is the hero on every device;
  // what made it expensive was loading it against first paint, not its weight.
  // The poster still wins the LCP because an eager clip waits for idle (below),
  // and genuinely constrained sessions still fall out here on Save-Data or a
  // 2G/3G hint.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const saveData = nav.connection?.saveData === true;
    const slow = /^(slow-2g|2g|3g)$/.test(nav.connection?.effectiveType ?? "");
    if (reduced || saveData || slow || media.provider === "mux") {
      setPosterOnly(true);
      return;
    }
    // `eager` marks the poster as the LCP element (priority below) — it must NOT
    // also start the video download, or the clip races first paint. Defer to
    // idle so the poster paints first and the loop arrives after.
    if (!eager) return;
    const start = () => setShouldLoad(true);
    const ric = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(ric as number);
      else window.clearTimeout(ric as number);
    };
  }, [eager, media.provider]);

  // `autoPlay` covers the happy path; this covers the blocked one, and is what
  // registers the gesture retry above once the element is actually in the DOM.
  useEffect(() => {
    if (shouldLoad) play();
  }, [shouldLoad, play]);

  // Mount/pause based on viewport proximity.
  useEffect(() => {
    if (posterOnly) return;
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Eager media hands the download to the idle callback above so the
          // poster keeps the LCP — don't let the observer pull it forward.
          if (!eager) setShouldLoad(true);
          play();
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [posterOnly, eager, play]);

  return (
    <div
      ref={containerRef}
      className={`${fill ? "absolute inset-0 size-full" : "relative"} overflow-hidden ${className}`}
      style={fill ? undefined : { aspectRatio: `${media.width} / ${media.height}` }}
    >
      {/* Poster — always present for instant paint + fallback */}
      <NextImage
        src={media.poster}
        alt={media.alt}
        fill
        sizes={sizes}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        priority={eager}
        className={`object-cover transition-opacity duration-700 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {!posterOnly && shouldLoad && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 size-full object-cover"
        >
          {media.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
    </div>
  );
}
