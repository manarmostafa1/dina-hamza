/* ------------------------------------------------------------------ *
 *  Teaching — the six classes in the sketchbook (Courses.tsx).
 *
 *  `art` is either a photo or a placeholder card. To swap a placeholder
 *  for a real piece later, replace it with
 *      art: { kind: "image", src: "/your-file.jpg", pos: "50% 50%" }
 *  `pos` is the CSS object-position used to frame it in the 4:5 card.
 * ------------------------------------------------------------------ */
export type CourseArt =
  | { kind: "image"; src: string; alt: string; pos?: string }
  | { kind: "placeholder"; tone: "sage" | "apricot"; icon: "pencil" | "tablet" };

export interface TeachingCourse {
  id: string;
  name: string;
  description: string;
  skills: string[];
  art: CourseArt;
  caption: string;
}

export const teachingCourses: TeachingCourse[] = [
  {
    id: "pencil",
    name: "Pencil drawing",
    description:
      "The foundations: line, form, proportion and shading. Building confidence from a blank page.",
    skills: ["Line", "Proportion", "Shading"],
    art: { kind: "placeholder", tone: "sage", icon: "pencil" },
    caption: "Warm-up studies",
  },
  {
    id: "portrait",
    name: "Portrait drawing",
    description:
      "Capturing the human face with structure, likeness and expression, in graphite and charcoal.",
    skills: ["Structure", "Likeness", "Expression"],
    art: {
      kind: "image",
      src: "/art-pink-profile.jpg",
      alt: "In Profile — an oil pastel portrait by Dina Hamza",
      pos: "50% 22%",
    },
    caption: "In Profile, oil pastel",
  },
  {
    id: "acrylic",
    name: "Acrylic painting",
    description:
      "Colour, layering and texture on canvas. Bold, forgiving and full of energy.",
    skills: ["Colour", "Layering", "Texture"],
    art: {
      kind: "image",
      src: "/art-blue-eyes.jpg",
      alt: "Veiled Eyes — an acrylic painting of a woman's eyes above a blue veil, by Dina Hamza",
      pos: "50% 40%",
    },
    caption: "Veiled Eyes, acrylic on canvas",
  },
  {
    id: "oil",
    name: "Oil painting",
    description:
      "Rich blending, depth and light: the slow, luminous craft of classical painting.",
    skills: ["Blending", "Depth", "Light"],
    art: {
      kind: "image",
      src: "/art-girl-doll.jpg",
      alt: "The Doll — an oil painting of a girl holding a doll, by Dina Hamza",
      pos: "50% 45%",
    },
    caption: "The Doll, oil on canvas",
  },
  {
    id: "digital",
    name: "Digital illustration",
    description:
      "Drawing and painting on the iPad and desktop, from first sketch to finished artwork.",
    skills: ["Sketching", "Digital painting", "Finishing"],
    art: { kind: "placeholder", tone: "apricot", icon: "tablet" },
    caption: "iPad and desktop",
  },
  {
    id: "workshops",
    name: "Creative workshops",
    description:
      "Playful single-session workshops exploring colour, mixed media and imagination. No experience needed.",
    skills: ["Colour", "Mixed media", "Imagination"],
    art: {
      kind: "image",
      src: "/dina-about.jpg",
      alt: "Dina Hamza outdoors, holding two of her large abstract paintings",
      /* the subject sits low in this phone photo */
      pos: "35% 78%",
    },
    caption: "One session, no experience needed",
  },
];

/** Opens on Acrylic painting. */
export const DEFAULT_COURSE = "acrylic";
