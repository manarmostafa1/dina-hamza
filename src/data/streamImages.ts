import type { StreamImage } from "@/components/ui/image-stream-hero";

/* ------------------------------------------------------------------ *
 *  Artwork for the hero corridor.
 *
 *  These point at /public/stream/, the compressed card-shaped
 *  derivatives built by `npm run generate:stream` — NOT the
 *  full-resolution paintings, which stay in /public for the gallery and
 *  case-study pages. Twelve originals totalling 3.03MB become 791KB
 *  (desktop) / 359KB (mobile).
 *
 *  ORDER: card `i` is dropped into the corridor at u = i / cards by its
 *  negative animation delay, so on the FIRST FRAME the high indices are
 *  the large, near cards and index 0 is the speck at the vanishing
 *  point. After that every card cycles the whole corridor, so ordering
 *  only decides what you see in the opening moment — and which files
 *  are worth preloading (see index.html).
 *
 *  Mobile runs 7 cards, so it uses indices 0-6 only; index 6 is its
 *  largest opening card. Desktop runs 12 cards against 11 images, so
 *  index 0 appears twice — at the vanishing point and at the exit,
 *  which are never adjacent.
 *
 *  The corridor is aria-hidden, so none of this alt text is announced.
 *  It is here so the array stays readable and so the entries can be
 *  reused anywhere that isn't decorative.
 * ------------------------------------------------------------------ */

type Entry = { file: string; alt: string };

const ART: Entry[] = [
  // --- far end of the corridor on first paint: small, behind the scrim
  { file: "art-abstract-city", alt: "Cityscape — palette-knife abstract in blues and ochre" },
  { file: "art-vintage-frame", alt: "Timekeeper — sepia portrait of a woman in a painted frame" },
  { file: "art-deer", alt: "Fawn — oil pastel of a deer against spring greens" },
  { file: "art-amazigh", alt: "Amazigh — soft pastel portrait of a woman in a patterned headscarf" },

  // --- mid corridor
  { file: "art-pink-profile", alt: "In Profile — oil pastel portrait against a magenta ground" },
  { file: "art-blue-eyes", alt: "Veiled Eyes — acrylic portrait of a woman in a blue veil" },
  { file: "art-curly-bag", alt: "Sunlit — impressionist oil of a woman walking with a handbag" },

  // --- near end on first paint: the large cards
  { file: "art-warm-hijab", alt: "Warmth — oil portrait of a woman in a warm-toned hijab" },
  { file: "art-butterflies", alt: "Butterflies — oil self-portrait ringed with butterflies" },
  { file: "art-pink-butterflies", alt: "Pink Butterflies — oil self-portrait in pinks and lilacs" },
  { file: "art-girl-doll", alt: "The Doll — oil painting of a girl holding a rag doll" },
];

/** Desktop set — 640x860 derivatives. */
export const streamImages: StreamImage[] = ART.map((a) => ({
  src: `/stream/${a.file}.webp`,
  alt: a.alt,
}));

/** Mobile set — 420x564 derivatives. Only the first 7 are ever mounted. */
export const streamImagesSm: StreamImage[] = ART.map((a) => ({
  src: `/stream/sm/${a.file}.webp`,
  alt: a.alt,
}));
