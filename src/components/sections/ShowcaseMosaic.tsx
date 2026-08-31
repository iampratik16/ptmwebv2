import Img from "@/components/media/Img";
import Reveal from "@/components/motion/Reveal";
import { img } from "@/lib/media";

/**
 * Asymmetric showcase mosaic: one tall tile spanning both rows, with a 2x2 grid
 * beside it. Lives INSIDE the pinned manifesto so the pin has something to
 * reveal — the statement holds at the top of the viewport while these resolve
 * beneath it. Without cargo the pin was 810px of empty scroll.
 *
 * On mobile the tall tile drops to a normal cell and the whole thing becomes a
 * simple two-column grid; a 5-tile mosaic at phone width is unreadable.
 */
const TILES = [
  img("/media/showcase/01.jpg", "A laptop on a limestone ledge showing a venue website.", 1400, 2100),
  img("/media/showcase/02.jpg", "Foil-embossed oxblood business cards with rose gold edges beside a wax seal.", 1600, 1200),
  img("/media/showcase/03.jpg", "A candlelit dinner table dressed for a private event.", 1600, 1200),
  img("/media/showcase/04.jpg", "A hand holding a phone showing a beauty brand image feed.", 1600, 1200),
  img("/media/showcase/05.jpg", "A carved stone window surround on a period estate at golden hour.", 1600, 1200),
];

export default function ShowcaseMosaic({ className = "" }: { className?: string }) {
  const [feature, ...rest] = TILES;

  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 ${className}`}>
      {/* Feature tile — two columns and both rows on desktop. */}
      <Reveal
        media
        className="relative overflow-hidden rounded-(--radius-sm) sm:col-span-2 lg:row-span-2"
      >
        <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full">
          <Img
            media={feature}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      {rest.map((tile, i) => (
        <Reveal
          media
          key={tile.src}
          delay={90 * (i + 1)}
          className="relative overflow-hidden rounded-(--radius-sm)"
        >
          <div className="relative aspect-[4/3]">
            <Img
              media={tile}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
