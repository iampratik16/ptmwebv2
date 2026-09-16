import { Fragment } from "react";
import type { CSSProperties, ElementType } from "react";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** Base delay in ms before the stagger begins. */
  delay?: number;
};

/**
 * CSS-only, JS-free word-mask reveal for above-the-fold / LCP headings. Each
 * word rises within a clip mask via a transform animation (opacity stays 1, so
 * the text paints immediately and counts for LCP). No GSAP dependency, so the
 * signature headline reveal never waits on lazy JS. Reduced motion shows the
 * text statically. Below-the-fold headings use SplitHeading (GSAP) instead.
 */
export default function MaskHeading({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: Props) {
  // A "\n" in the text forces a line break. Natural wrapping cannot always put
  // the break where the sentence does: if the second sentence is longer than the
  // first line would need to be, no max-width exists that breaks between them.
  const lines = children.split("\n").map((line) => line.trim().split(" "));
  let index = 0;
  return (
    <Tag className={className} style={{ "--rl-base": `${delay}ms` } as CSSProperties}>
      {lines.map((words, lineNo) => (
        <Fragment key={lineNo}>
          {lineNo > 0 ? <br /> : null}
          {words.map((word, i) => {
            const stagger = index++;
            return (
              <Fragment key={i}>
                <span className="rl-word" style={{ "--i": stagger } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 ? " " : ""}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}
