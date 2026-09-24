import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";

interface MarqueeProps {
  /** The words, in order. The row loops them endlessly. */
  items: string[];
  /** Scroll right instead of left (the same loop, played in reverse). */
  reverse?: boolean;
  /** Set every second word in the tagline's serif italic. */
  alternate?: boolean;
  /**
   * Repeat the word list this many times per half of the loop. A half
   * must be at least as wide as the row, or the end of the track shows
   * before the loop resets.
   */
  repeat?: number;
  separator?: string;
  /** Render a screen-reader list of the words. Turn off for a row that
   *  repeats another row's words, so they are not announced twice. */
  announce?: boolean;
  className?: string;
}

/**
 * Infinite horizontal marquee. Styling lives in the `.marquee*` rules
 * in index.css.
 *
 * SEAMLESS LOOP. The track holds the list twice, as flat siblings —
 * word, star, word, star… — spaced by one flex `gap`. The track also
 * carries trailing padding equal to that gap, so its width is exactly
 * 2 × (one list + one gap per element), and translateX(-50%) lands the
 * second copy precisely where the first began. Without the padding
 * -50% falls half a gap short and the row visibly jumps at the reset.
 * Reversing plays the same keyframes backwards, so it is seamless too.
 *
 * Under prefers-reduced-motion the animation stops and the list renders
 * once, statically, centred.
 */
export function Marquee({
  items,
  reverse = false,
  alternate = false,
  repeat = 1,
  separator = "✦",
  announce = true,
  className,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const half = Array.from({ length: repeat }, () => items).flat();
  const row = reduced ? items : [...half, ...half];

  return (
    <div
      className={cn(
        "marquee",
        reverse && "marquee--reverse",
        reduced && "marquee--static",
        className
      )}
    >
      {announce && (
        <ul className="sr-only">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <div aria-hidden="true" className="marquee-track">
        {row.map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span
              className={cn(
                "marquee-word",
                /* By position in `items`, so both halves match exactly. */
                alternate && (i % items.length) % 2 === 1 && "marquee-word--alt"
              )}
            >
              {item}
            </span>
            <span className="marquee-sep">{separator}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  MarqueeBand — two crossing tapes at the foot of the hero, like tape
 *  stuck across a canvas.
 *
 *    back   ink, tilted +2deg, scrolls right, 50s, edges faded
 *    front  terracotta, tilted -2.5deg, scrolls left, 35s, shadowed
 *
 *  Both tapes are 110vw wide and centred on the container, so they
 *  cross in the middle and their rotated ends never expose a corner.
 *  The container clips X only (overflow-x: clip): no horizontal page
 *  scroll, but the tilted top and bottom edges are not cut off.
 *
 *  The back tape starts half way through the list so the two tapes
 *  never show the same word at the crossing.
 *
 *  repeat={2}: one pass of the six words is ~1,600px; a 110vw tape on
 *  a 2560 screen is 2,816px, so two passes per half cover it.
 *
 *  data-nav="dark" so the navbar pill inverts while it passes over the
 *  tapes. data-surface stays light: the tapes paint ink, terracotta and
 *  cream from the light tokens directly.
 * ------------------------------------------------------------------ */
export function MarqueeBand({ items }: { items: string[] }) {
  const mid = Math.ceil(items.length / 2);
  const shifted = [...items.slice(mid), ...items.slice(0, mid)];

  return (
    <div data-surface="light" data-nav="dark" className="marquee-tapes">
      <div className="marquee-tape marquee-tape--back">
        <Marquee
          items={shifted}
          reverse
          alternate
          repeat={2}
          announce={false}
        />
      </div>
      <div className="marquee-tape marquee-tape--front">
        <Marquee items={items} alternate repeat={2} />
      </div>
    </div>
  );
}
