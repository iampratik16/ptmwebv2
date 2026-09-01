"use client";

import { useEffect, useRef, useState } from "react";
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

  // Decide whether to ever play video. Poster only under reduced motion,
  // Save-Data, on phones, or when a Mux source hasn't been wired up yet.
  //
  // Phones are poster-only on purpose: the hero loop is ~3.7MB, and shipping it
  // over throttled 4G took Speed Index to 7.4s and LCP to 3.4s on a Lighthouse
  // mobile run. The poster is ~230KB and the composition reads identically.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = nav.connection?.saveData === true;
    const phone = window.matchMedia("(max-width: 767px)").matches;
    // Respect an explicit slow-connection hint too, on any viewport.
    const slow = /^(slow-2g|2g|3g)$/.test(
      (nav as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType ?? "",
    );
    if (reduced || saveData || phone || slow || media.provider === "mux") {
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

  // Mount/pause based on viewport proximity.
  useEffect(() => {
    if (posterOnly) return;
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [posterOnly]);

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
