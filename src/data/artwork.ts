/* ------------------------------------------------------------------ *
 *  Dina's personal artwork — the standalone paintings & drawings that
 *  live directly in /public (NOT the Portfolio-* project folders).
 *  Used exclusively by the "Illustration — From my sketchbook" section.
 *
 *  A few source photos show the artwork in a room / on an easel, or
 *  carry a baked-in social badge, so each piece can define a focal
 *  point + zoom to frame just the artwork:
 *    · focal    — CSS objectPosition + transformOrigin (e.g. "50% 30%")
 *    · scale    — zoom factor to crop out room / easel / badge
 *    · coverBox — also crop (object-cover) inside the lightbox; without
 *                 it the lightbox shows the full, uncropped painting.
 *  Titles/mediums are descriptive labels you can edit freely.
 * ------------------------------------------------------------------ */
export interface ArtPiece {
  id: string;
  src: string;
  title: string;
  medium: string;
  focal?: string;
  scale?: number;
  coverBox?: boolean;
}

export const artwork: ArtPiece[] = [
  { id: "blue-eyes", src: "/art-blue-eyes.jpg", title: "Veiled Eyes", medium: "Acrylic on canvas" },
  { id: "girl-doll", src: "/art-girl-doll.jpg", title: "The Doll", medium: "Oil on canvas" },
  { id: "pink-profile", src: "/art-pink-profile.jpg", title: "In Profile", medium: "Oil pastel", focal: "50% 22%" },
  { id: "curly-bag", src: "/art-curly-bag.jpg", title: "Sunlit", medium: "Oil on canvas" },
  { id: "warm-hijab", src: "/art-warm-hijab.jpg", title: "Warmth", medium: "Oil on canvas" },
  { id: "butterflies", src: "/art-butterflies.jpg", title: "Butterflies", medium: "Oil on canvas", focal: "50% 50%", scale: 1.12 },
  { id: "pink-butterflies", src: "/art-pink-butterflies.jpg", title: "Pink Butterflies", medium: "Oil on canvas", focal: "50% 46%", scale: 1.1 },
  { id: "amazigh", src: "/art-amazigh.jpg", title: "Amazigh", medium: "Soft pastel", focal: "49% 44%", scale: 1.5, coverBox: true },
  { id: "deer", src: "/art-deer.jpg", title: "Fawn", medium: "Oil pastel", focal: "50% 43%", scale: 1.55, coverBox: true },
  { id: "vintage-frame", src: "/art-vintage-frame.jpg", title: "Timekeeper", medium: "Oil on canvas", focal: "50% 48%", scale: 1.14 },
  { id: "abstract-city", src: "/art-abstract-city.jpg", title: "Cityscape", medium: "Palette knife", focal: "50% 27%", scale: 2.5, coverBox: true },
  { id: "abstract-teal", src: "/art-abstract-teal.jpg", title: "Cool Currents", medium: "Palette knife", focal: "49% 40%", scale: 2.05, coverBox: true },
  { id: "abstract-warm", src: "/art-abstract-warm.jpg", title: "Warm Currents", medium: "Palette knife", focal: "50% 26%", scale: 2.25, coverBox: true },
];
