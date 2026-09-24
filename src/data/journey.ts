/* ------------------------------------------------------------------ *
 *  The road here — everything the timeline section shows.
 *
 *  chapters   chronological (oldest first), left → right on desktop.
 *             `current: true` marks the chapter that gets the highlight
 *             (apricot dot, italic year, "Now" pill, card). Keep one.
 *  lead       the paragraph beside the section title
 *  education  the line under the chapters
 * ------------------------------------------------------------------ */
export interface Chapter {
  year: string;
  range: string;
  role: string;
  company: string;
  description: string;
  current?: boolean;
}

export const journeyLead =
  "Three years of in-house and remote design work after a degree in Applied Arts, always with a pencil somewhere nearby.";

export const education = {
  degree: "B.A. Applied Arts, Advertising and Graphics",
  school: "New Cairo Academy · 2023",
};

export const chapters: Chapter[] = [
  {
    year: "2022",
    range: "Aug — Sep 2022",
    role: "Graphic designer intern",
    company: "Al-Ahram Advertising Agency, Cairo",
    description:
      "Summer training in advertising design at Al-Ahram Advertising Agency in Ramses, Cairo.",
  },
  {
    year: "2023",
    range: "Aug 2023 — May 2024",
    role: "Graphic designer",
    company: "Artix Fofana, remote",
    description:
      "Designed print materials, brochures and signs, plus social graphics, short videos, GIFs and motion, with colour correction and grading.",
  },
  {
    year: "2024",
    range: "Jun 2024 — May 2025",
    role: "Graphic designer",
    company: "SMILE MAKERS Tourism, Heliopolis",
    description:
      "Created social media graphics and motion content, managed several projects at once and kept branding consistent across all company materials.",
  },
  {
    year: "2025",
    range: "Jun 2025 — Present",
    role: "Graphic designer",
    company: "Everlast Wellness Medical Center",
    description:
      "Built the full brand identity (logo, palette, type and guidelines) and run the main social account, from posts and reels to seasonal campaigns.",
    current: true,
  },
];
