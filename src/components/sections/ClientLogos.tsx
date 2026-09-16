import Image from "next/image";
import Reveal from "@/components/motion/Reveal";

/**
 * Client logo strip — the trust bar, directly above the footer.
 *
 * Every logo here is the artwork as supplied; nothing is recoloured. That has a
 * consequence the layout has to carry, because the five files do not agree on
 * what background they need:
 *
 *   Aya, Central      dark and gold marks baked onto opaque cream/white boxes.
 *                     `mix-blend-multiply` dissolves those grounds into the
 *                     light band, so the mark survives and the box does not.
 *   North Mymms       dark on transparency; sits on the light band untouched.
 *   Chigwell, Swifty  WHITE artwork (Swifty measures 254,254,254; Chigwell is
 *                     white text with a gold crown). On a pale ground these are
 *                     invisible, so each sits on an ink tile — the ground the
 *                     artwork was drawn for. No blend on those two: multiply
 *                     would turn the white straight back into black.
 *
 * Heights are per logo, not shared. These run from roughly 1:1 (Aya) to 4:1
 * (Chigwell), so a single height would make the wide marks enormous beside the
 * square ones. The values below are tuned for equal optical weight, which is
 * what makes the spacing read as even.
 */
const CLIENTS = [
  {
    name: "Aya Beauty",
    src: "/media/clients/aya-beauty.png",
    width: 225,
    height: 225,
    size: "h-14 sm:h-20",
  },
  {
    name: "Central Restaurant & Lounge",
    src: "/media/clients/central.png",
    width: 589,
    height: 521,
    size: "h-14 sm:h-20",
  },
  {
    name: "North Mymms Park",
    src: "/media/clients/north-mymms.png",
    width: 587,
    height: 239,
    size: "h-12 sm:h-16",
  },
  {
    name: "The Chigwell Marquees",
    src: "/media/clients/chigwell.png",
    width: 640,
    height: 159,
    size: "h-8 sm:h-11",
    onDark: true,
  },
  {
    name: "Swifty Beats",
    src: "/media/clients/swifty-beats.png",
    width: 384,
    height: 133,
    size: "h-9 sm:h-12",
    onDark: true,
  },
] as const;

export default function ClientLogos() {
  return (
    <section
      className="section container-page border-t border-(--color-hairline)"
      aria-label="Clients"
    >
      <Reveal as="p" className="eyebrow text-center">
        Trusted by
      </Reveal>

      {/* justify-between rather than equal grid columns: equal columns leave the
          gaps LOOKING uneven, because a narrow mark floats in the middle of its
          cell while a wide one fills it. Distributing the leftover space between
          the rendered logos is what actually reads as evenly spaced. */}
      <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-10 sm:mt-14 lg:flex-nowrap lg:justify-between lg:gap-x-6">
        {CLIENTS.map((client, i) => (
          <Reveal as="li" key={client.name} delay={i * 80}>
            {"onDark" in client && client.onDark ? (
              <span className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-(--color-ink) px-6 py-4 sm:px-8 sm:py-5">
                <Image
                  src={client.src}
                  alt={client.name}
                  width={client.width}
                  height={client.height}
                  sizes="240px"
                  className={`${client.size} w-auto`}
                />
              </span>
            ) : (
              <Image
                src={client.src}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="240px"
                className={`${client.size} w-auto mix-blend-multiply`}
              />
            )}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
