/* ------------------------------------------------------------------ *
 *  Project display data — EDIT THESE.
 *
 *  Keyed by the project's folder in /public, so the values survive the
 *  auto-generation in scripts/generate-portfolio.mjs (which rebuilds
 *  portfolio.generated.ts from the folders and would overwrite anything
 *  typed there).
 *
 *    title     the name shown on the card
 *    featured  shown in the home page grid (in data order); every
 *              project, featured or not, is listed on /work
 *    description  the paragraph under the title on the project page
 *                 (/work/<slug>). Always shown.
 *
 *  A folder with no entry keeps its generated "Project NN" title and
 *  is not featured.
 * ------------------------------------------------------------------ */
export const projectMeta: Record<
  string,
  { title: string; featured: boolean; description: string }
> = {
  "Portfolio-1": {
    title: "Summer Glow",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-2": {
    title: "July Offers",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-3": {
    title: "Flash Sale",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-4": {
    title: "November Offers",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-5": {
    title: "White Friday",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-6": {
    title: "Instagram Feed",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-7": {
    title: "Our 10th Birthday",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-8": {
    title: "Golden Hours",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-9": {
    title: "Last Week of June",
    featured: false,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-10": {
    title: "Eid Offers",
    featured: false,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-11": {
    title: "App Screens",
    featured: false,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-12": {
    title: "Clinic Brochure",
    featured: false,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-13": {
    title: "MY Wellness Campaign",
    featured: false,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-14": {
    title: "Skintrix 360",
    featured: true,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
  "Portfolio-15": {
    title: "10 Years of Beauty",
    featured: false,
    description:
      "A selected project from Dina Hamza's portfolio. This is a placeholder description — replace it with the brief, your role, and the outcome to turn it into a full case study.",
  },
};
