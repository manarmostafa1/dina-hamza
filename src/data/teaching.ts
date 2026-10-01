/* ------------------------------------------------------------------ *
 *  Teaching — the classes in the sketchbook (Courses.tsx), in tab
 *  order. Tab numbers, "Class NN of NN", the page folio and the Next
 *  page loop all come from this list, so adding or removing a class
 *  needs no other change.
 *
 *  `art` is the taped photo on the left page. `pos` is the CSS
 *  object-position used to frame it in the 4:5 card. File names must be
 *  lowercase with no spaces (they are URLs on a case-sensitive host).
 * ------------------------------------------------------------------ */
export type CourseArt = { src: string; alt: string; pos?: string };

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
    art: {
      src: "/teaching/pencil-drawing.jpg",
      alt: "Pencil drawing from Dina's drawing class",
      /* the students sit in the upper half of this phone photo */
      pos: "50% 40%",
    },
    caption: "Warm-up studies",
  },
  {
    id: "portrait",
    name: "Portrait drawing",
    description:
      "Capturing the human face with structure, likeness and expression, in graphite and charcoal.",
    skills: ["Structure", "Likeness", "Expression"],
    art: {
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
      src: "/art-girl-doll.jpg",
      alt: "The Doll — an oil painting of a girl holding a doll, by Dina Hamza",
      pos: "50% 45%",
    },
    caption: "The Doll, oil on canvas",
  },
  {
    id: "workshops",
    name: "Creative workshops",
    description:
      "Playful single-session workshops exploring colour, mixed media and imagination. No experience needed.",
    skills: ["Colour", "Mixed media", "Imagination"],
    art: {
      src: "/teaching/creative-workshops.jpg",
      alt: "Creative art workshop by Dina",
      /* the paintings sit in the lower half of this phone photo */
      pos: "50% 58%",
    },
    caption: "One session, no experience needed",
  },
];

/** Opens on Acrylic painting. */
export const DEFAULT_COURSE = "acrylic";
