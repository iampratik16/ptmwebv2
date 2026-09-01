import type { CSSProperties } from "react";
import Image from "next/image";
import TransitionLink from "@/components/ui/TransitionLink";
import Reveal from "@/components/motion/Reveal";
import Logo from "@/components/layout/Logo";
import FooterBallpit from "@/components/media/FooterBallpit";
import { ArrowUpRight, Instagram } from "@/components/ui/icons";
import { CONTACT, NAV, SITE } from "@/lib/site";
import { getBlur, img } from "@/lib/media";

// ── Footer background: two versions kept side by side ───────────────────────
//   "image"   → static minimalist pink marketing still-life (Vertex AI). Light
//               background, so the footer switches to a LIGHT treatment
//               (dark ink text, light scrim, colour logo).
//   "ballpit" → the ambient 3D bubbles (FooterBallpit) with the DARK treatment
//               (cream text on ink). Still fully intact.
// Flip this single value to switch back to the dynamic footer any time.
const FOOTER_VARIANT: "image" | "ballpit" = "image";

// ?v bumped whenever the image file is regenerated in place — Next's image
// optimiser caches by URL, so the query is what busts the stale optimised copy.
const FOOTER_IMAGE = "/media/footer/marketing.jpg";
// Route through the shared media helper so this busts with every other
// asset. A hardcoded ?v=2 here meant a replaced file kept serving stale.
const FOOTER_IMAGE_SRC = img(FOOTER_IMAGE, "", 2400, 1350).src;

export default function Footer() {
  const year = 2026;
  const isImage = FOOTER_VARIANT === "image";

  // All footer text colour flows from this one variable; only the structural
  // bits (scrim, halo, logo, shadows) branch on the variant below.
  const fgStyle = {
    "--footer-fg": isImage ? "var(--color-ink)" : "var(--color-paper-on-dark)",
  } as CSSProperties;

  return (
    <footer
      style={fgStyle}
      className="relative isolate overflow-hidden bg-(--color-ink) text-(--footer-fg)"
    >
      {/* Background — static marketing image or the ambient bubbles (see FOOTER_VARIANT) */}
      {isImage ? (
        <div aria-hidden className="absolute inset-0 z-0">
          <Image
            src={FOOTER_IMAGE_SRC}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={getBlur(FOOTER_IMAGE)}
            className="object-cover object-center"
          />
        </div>
      ) : (
        <FooterBallpit />
      )}

      {/* Scrim — light image: gently lift the bottom so the detail columns read;
          bubbles: darken toward the bottom so cream text stays legible. */}
      {isImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-(--color-paper) via-(--color-paper)/88 via-45% to-transparent to-72%"
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-(--color-ink)/20 via-(--color-ink)/45 to-(--color-ink)/92"
        />
      )}

      <div className="container-page relative z-10 pt-[clamp(3rem,6vh,4.5rem)] pb-[clamp(2rem,4vh,3rem)]">
        {/* Closing invitation */}
        <div className="relative -mt-4">
          {/* Soft dark halo so the ivory headline reads over whatever the
              background is doing. The image has a bright window in frame, so
              this is measured against its p95: ivory over ~60% ink = 4.95:1. */}
          <div
            aria-hidden
            className={
              isImage
                ? "pointer-events-none absolute -inset-x-[40vw] -inset-y-24 z-0 bg-[radial-gradient(42%_120%_at_28%_50%,rgba(26,16,18,0.86),rgba(26,16,18,0.5)_42%,rgba(26,16,18,0.18)_66%,transparent_84%)]"
                : "pointer-events-none absolute -inset-x-10 -inset-y-8 z-0 bg-[radial-gradient(70%_130%_at_16%_50%,rgba(20,17,15,0.78),rgba(20,17,15,0.2)_58%,transparent_80%)]"
            }
          />
          <Reveal className="relative z-10 flex min-h-[clamp(96px,13vh,150px)] flex-col justify-center">
            <p
              className="eyebrow tracking-[0.2em] text-(--color-paper-on-dark)/85"
            >
              Start a conversation
            </p>
            <TransitionLink href="/contact" className="group mt-6 inline-flex items-end gap-4">
              <span
                className="font-(family-name:--font-label) text-[clamp(2.25rem,6.5vw,5rem)] font-light uppercase leading-[1.02] tracking-[0.02em] text-(--color-paper-on-dark)"
              >
                Let’s begin
              </span>
              <ArrowUpRight
                className={`mb-2 size-[clamp(1.4rem,3.2vw,2.25rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:-translate-y-2 ${
                  isImage
                    ? "text-(--color-accent-ink)"
                    : "text-(--color-accent-soft) drop-shadow-[0_2px_10px_rgba(20,17,15,0.85)]"
                }`}
              />
            </TransitionLink>
          </Reveal>
        </div>

        <hr
          className={`mt-10 h-px w-full border-0 ${
            isImage ? "bg-(--color-hairline)" : "bg-(--color-hairline-dark)"
          }`}
        />

        {/* Detail columns */}
        <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo onDark={!isImage} className="h-14 sm:h-16" />
            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-(--footer-fg)/75">
              A UK luxury creative consultancy. Complete marketing solutions for
              ambitious brands.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="eyebrow text-(--footer-fg)/70">Menu</p>
            {NAV.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="link-underline w-fit text-sm text-(--footer-fg)/85 hover:text-(--footer-fg)"
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="eyebrow text-(--footer-fg)/70">Contact</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="link-underline w-fit text-sm text-(--footer-fg)/85 hover:text-(--footer-fg)"
            >
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phoneHref}`}
              className="link-underline w-fit text-sm text-(--footer-fg)/85 hover:text-(--footer-fg)"
            >
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-2 text-sm text-(--footer-fg)/85 hover:text-(--footer-fg)"
            >
              <Instagram className="size-4" />
              {CONTACT.social.handle}
            </a>
          </div>

          <address className="not-italic">
            <p className="eyebrow text-(--footer-fg)/70">Studio</p>
            <p className="mt-3 text-sm leading-relaxed text-(--footer-fg)/85">
              {CONTACT.address.street}
              <br />
              {CONTACT.address.locality}
              <br />
              {CONTACT.address.postalCode}
              <br />
              {CONTACT.address.country}
            </p>
          </address>
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 text-xs text-(--footer-fg)/70 sm:flex-row sm:items-center">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
