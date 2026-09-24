/* ------------------------------------------------------------------ *
 *  Central content model for Dina Hamza's portfolio.
 *  Artwork is rendered generatively (see GradientArt) so the site is
 *  fully self-contained — swap `palette` arrays for real imagery later.
 * ------------------------------------------------------------------ */

export type ProjectCategory =
  | "Branding"
  | "Logos"
  | "Social Media"
  | "Illustration"
  | "Motion"
  | "Print";

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  year: string;
  tagline: string;
  palette: [string, string, string];
  tags: string[];
  overview: string;
  problem: string;
  solution: string;
  process: { title: string; body: string }[];
  deliverables: string[];
  gallery: { label: string; palette: [string, string, string]; tall?: boolean }[];
}

export const projects: Project[] = [
  {
    slug: "maison-flora",
    title: "Maison Flora",
    client: "Maison Flora — Botanical Skincare",
    category: "Branding",
    year: "2025",
    tagline: "A botanical skincare identity that blooms across every touchpoint.",
    palette: ["#0FBFA6", "#FF9F1C", "#141210"],
    tags: ["Brand Identity", "Packaging", "Art Direction"],
    overview:
      "Maison Flora is a slow-beauty skincare house rooted in botanical apothecary traditions. The brand needed an identity that felt equal parts scientific and poetic — luxurious enough for a beauty counter, warm enough for a bedside table.",
    problem:
      "The founder had a beautiful product but a generic look that disappeared on the shelf. Nothing signalled the hand-formulated, small-batch story, and the wordmark broke down at small sizes on social.",
    solution:
      "I built a living identity around a custom botanical monogram and a flexible 'pressed-flower' grid. A serif wordmark carries heritage while a bright citrus accent keeps it modern. The system flexes from foil-stamped boxes to 9:16 reels without losing itself.",
    process: [
      { title: "Discovery", body: "Founder interviews, competitor teardown and a mood territory workshop to find the white space between clinical and craft." },
      { title: "Concept", body: "Three distinct territories explored, from herbarium-inspired to bold apothecary. We converged on 'modern herbarium'." },
      { title: "Design", body: "Custom monogram, type pairing, colour system and a modular layout grid built for both print and screen." },
      { title: "Rollout", body: "Packaging, unboxing experience, a launch campaign and a 40-page brand book handed to the in-house team." },
    ],
    deliverables: ["Logo & monogram suite", "Packaging system", "Brand guidelines", "Launch campaign", "Social templates"],
    gallery: [
      { label: "Primary logotype", palette: ["#0FBFA6", "#FFFFFF", "#141210"] },
      { label: "Packaging system", palette: ["#FF9F1C", "#0FBFA6", "#141210"], tall: true },
      { label: "Editorial spreads", palette: ["#141210", "#FF9F1C", "#0FBFA6"] },
      { label: "Social rollout", palette: ["#0FBFA6", "#141210", "#FF9F1C"] },
    ],
  },
  {
    slug: "nova-fintech",
    title: "Nova",
    client: "Nova — Personal Finance App",
    category: "Logos",
    year: "2025",
    tagline: "A confident mark for a fintech that makes money feel calm.",
    palette: ["#2D6BFF", "#7C4DFF", "#141210"],
    tags: ["Logo Design", "Visual System", "Iconography"],
    overview:
      "Nova helps first-time investors build steady habits. The mark had to feel trustworthy like a bank yet friendly like an app you'd open every morning.",
    problem:
      "Early logo attempts leaned either too corporate or too playful. Nova needed a single symbol that scaled from an app icon to a rooftop sign.",
    solution:
      "A geometric 'N' that resolves into a rising spark — optimism engineered on a strict grid. Paired with a warm-cool gradient reserved only for hero moments to keep the system disciplined.",
    process: [
      { title: "Audit", body: "Mapped the competitive fintech landscape to avoid the sea of generic blue swooshes." },
      { title: "Sketch", body: "Over 120 pencil marks narrowed to five grid-built directions." },
      { title: "Refine", body: "Optical corrections, motion tests and legibility trials down to 16px." },
      { title: "System", body: "Icon set, gradient rules and a motion signature for the loading state." },
    ],
    deliverables: ["Logo system", "App icon", "Iconography set", "Motion signature", "Usage guide"],
    gallery: [
      { label: "The mark", palette: ["#2D6BFF", "#FFFFFF", "#7C4DFF"] },
      { label: "Construction grid", palette: ["#141210", "#2D6BFF", "#7C4DFF"] },
      { label: "App icon", palette: ["#7C4DFF", "#2D6BFF", "#FFFFFF"], tall: true },
      { label: "In context", palette: ["#2D6BFF", "#141210", "#7C4DFF"] },
    ],
  },
  {
    slug: "sunday-sounds",
    title: "Sunday Sounds",
    client: "Sunday Sounds — Music Festival",
    category: "Social Media",
    year: "2024",
    tagline: "A sun-drenched social campaign that turned scrolls into ticket sales.",
    palette: ["#FF5A47", "#FF9F1C", "#7C4DFF"],
    tags: ["Social Campaign", "Content System", "Motion"],
    overview:
      "An independent music festival needed a social identity loud enough to cut through summer feeds and consistent enough to run for eight weeks of countdown content.",
    problem:
      "Previous years had no content system — every post looked different and engagement fell flat once the line-up dropped.",
    solution:
      "A modular sticker-and-sunburst kit with animated headliner reveals. Bold type, warm gradients and a repeatable grid meant the small team could ship daily without a designer on call.",
    process: [
      { title: "Strategy", body: "Content pillars mapped to the eight-week countdown calendar." },
      { title: "Kit", body: "A reusable Figma + After Effects template kit for posts, stories and reels." },
      { title: "Motion", body: "Headliner reveal animations and looping ticket-drop teasers." },
      { title: "Handover", body: "A short Loom playbook so the team could self-serve." },
    ],
    deliverables: ["Campaign key art", "Story & reel templates", "Motion reveals", "Content playbook"],
    gallery: [
      { label: "Key visual", palette: ["#FF5A47", "#FF9F1C", "#7C4DFF"], tall: true },
      { label: "Story kit", palette: ["#7C4DFF", "#FF5A47", "#FF9F1C"] },
      { label: "Reel frames", palette: ["#FF9F1C", "#7C4DFF", "#FF5A47"] },
      { label: "Line-up reveal", palette: ["#FF5A47", "#141210", "#FF9F1C"] },
    ],
  },
  {
    slug: "wildwood-tales",
    title: "Wildwood Tales",
    client: "Wildwood Tales — Children's Book",
    category: "Illustration",
    year: "2024",
    tagline: "Hand-drawn worlds for a bedtime story about a brave little fox.",
    palette: ["#FF9F1C", "#0FBFA6", "#FF5A47"],
    tags: ["Illustration", "Character Design", "Editorial"],
    overview:
      "A 32-page picture book following a curious fox through four seasons of a living forest, illustrated in a warm gouache-inspired digital style.",
    problem:
      "The author wanted illustrations that felt handmade and timeless — not the flat vector style flooding the category.",
    solution:
      "A textured, painterly digital technique with a limited seasonal palette. Consistent character model sheets kept the fox on-model across every spread while lighting carried the emotional arc.",
    process: [
      { title: "Character", body: "Model sheets and expression studies for the cast." },
      { title: "Storyboard", body: "Thumbnail pacing across all 16 spreads for rhythm." },
      { title: "Paint", body: "Textured digital painting with a seasonal colour script." },
      { title: "Layout", body: "Type integration and print-ready CMYK preparation." },
    ],
    deliverables: ["16 full spreads", "Character sheets", "Cover art", "Endpapers"],
    gallery: [
      { label: "Cover art", palette: ["#FF9F1C", "#0FBFA6", "#FF5A47"], tall: true },
      { label: "Spring spread", palette: ["#0FBFA6", "#FF9F1C", "#FF5A47"] },
      { label: "Character sheet", palette: ["#FF5A47", "#FF9F1C", "#0FBFA6"] },
      { label: "Winter spread", palette: ["#2D6BFF", "#0FBFA6", "#FF9F1C"] },
    ],
  },
  {
    slug: "pulse-motion",
    title: "Pulse",
    client: "Pulse — Wellness Studio",
    category: "Motion",
    year: "2025",
    tagline: "A kinetic brand system that breathes with every animation.",
    palette: ["#7C4DFF", "#0FBFA6", "#2D6BFF"],
    tags: ["Motion Design", "Brand Animation", "Title Sequence"],
    overview:
      "Pulse is a boutique wellness studio. Their static brand was elegant but lifeless online, so I designed a motion language that made the identity move like breath.",
    problem:
      "The logo and colours were strong but every video felt stiff, with mismatched transitions and no shared timing.",
    solution:
      "A motion system built on a single easing curve and a breathing-rhythm timeline. Logo stings, lower-thirds and class intros all share the same DNA, so any editor can stay on-brand.",
    process: [
      { title: "Language", body: "Defined easing, timing and a 'breathe in / breathe out' motion metaphor." },
      { title: "Toolkit", body: "After Effects templates for stings, titles and social cut-downs." },
      { title: "Sound", body: "Paired motion beats with a subtle sonic signature." },
      { title: "Guide", body: "A motion guideline doc plus source project files." },
    ],
    deliverables: ["Logo animation", "Title system", "Social templates", "Motion guidelines"],
    gallery: [
      { label: "Logo sting", palette: ["#7C4DFF", "#0FBFA6", "#2D6BFF"] },
      { label: "Title system", palette: ["#0FBFA6", "#7C4DFF", "#2D6BFF"], tall: true },
      { label: "Lower thirds", palette: ["#2D6BFF", "#7C4DFF", "#0FBFA6"] },
      { label: "Class intro", palette: ["#7C4DFF", "#141210", "#0FBFA6"] },
    ],
  },
  {
    slug: "atlas-annual",
    title: "Atlas Report",
    client: "Atlas Foundation — Annual Report",
    category: "Print",
    year: "2024",
    tagline: "An 80-page annual report designed to actually be read.",
    palette: ["#141210", "#FF5A47", "#FF9F1C"],
    tags: ["Editorial", "Print", "Data Visualisation"],
    overview:
      "A non-profit's annual report reimagined as a tactile editorial object — one people would keep on the desk rather than recycle.",
    problem:
      "Dense impact data and long-form stories were drowning in a cramped, text-heavy old template nobody finished reading.",
    solution:
      "A generous editorial grid, a warm duotone photo treatment and a family of custom data visualisations turned numbers into narrative. Uncoated stock and a soft-touch cover made it a keepsake.",
    process: [
      { title: "Content", body: "Editing pass to shape the narrative and cut noise." },
      { title: "Grid", body: "A flexible baseline grid balancing story and data." },
      { title: "Data", body: "Custom charts and infographics from the impact numbers." },
      { title: "Print", body: "Paper selection, proofing and press supervision." },
    ],
    deliverables: ["80-page report", "Data visual system", "Cover design", "Print specification"],
    gallery: [
      { label: "Cover", palette: ["#141210", "#FF5A47", "#FF9F1C"], tall: true },
      { label: "Data spreads", palette: ["#FF5A47", "#141210", "#FF9F1C"] },
      { label: "Story spread", palette: ["#FF9F1C", "#141210", "#FF5A47"] },
      { label: "Infographics", palette: ["#FF5A47", "#FF9F1C", "#141210"] },
    ],
  },
];

export const projectCategories: (ProjectCategory | "All")[] = [
  "All",
  "Branding",
  "Logos",
  "Social Media",
  "Illustration",
  "Motion",
  "Print",
];

/* ---------------------------------- Services --------------------------------- */
export interface Service {
  title: string;
  description: string;
  /** Rendered as pills on the cards that carry them. */
  tags?: string[];
}

/* Six design services, in the order the bento reads them. Teaching is
   not here: it is a different kind of offer and has its own section
   (Courses.tsx). */
export const services: Service[] = [
  { title: "Brand identity and logo design", description: "Complete identity systems — strategy, logo, type and guidelines — with distinctive, grid-built marks that scale from an app icon to a billboard.", tags: ["Logo suite", "Colour system", "Typography", "Guidelines"] },
  { title: "Social media design", description: "Content systems and templates that keep feeds consistent, on-brand and thumb-stopping." },
  { title: "Print design", description: "Editorial, packaging and collateral prepared print-ready, with a real love for paper." },
  { title: "Presentation design", description: "Considered, story-first decks and pitch designs that make ideas land with clarity." },
  { title: "Video and motion", description: "Short-form video, animated GIFs and motion graphics — cut, composited and colour-graded for the feed.", tags: ["Reels", "Colour grading", "Compositing"] },
  { title: "Illustration and digital art", description: "Custom traditional and digital illustration, character design and editorial artwork.", tags: ["Character", "Editorial", "Retouch"] },
];

/* --------------------------------- Illustrations ------------------------------ */
export interface Illustration {
  id: string;
  title: string;
  medium: string;
  palette: [string, string, string];
  span: "sm" | "md" | "lg" | "wide";
}

export const illustrations: Illustration[] = [
  { id: "il-1", title: "Golden Hour", medium: "Digital · Procreate", palette: ["#FF9F1C", "#FF5A47", "#7C4DFF"], span: "lg" },
  { id: "il-2", title: "Still Waters", medium: "Gouache", palette: ["#0FBFA6", "#2D6BFF", "#F8F7F5"], span: "sm" },
  { id: "il-3", title: "City in Bloom", medium: "Digital · Ink", palette: ["#FF5A47", "#FF9F1C", "#0FBFA6"], span: "md" },
  { id: "il-4", title: "Portrait No. 7", medium: "Charcoal", palette: ["#141210", "#FF9F1C", "#8A847C"], span: "sm" },
  { id: "il-5", title: "Midnight Garden", medium: "Digital", palette: ["#7C4DFF", "#2D6BFF", "#0FBFA6"], span: "wide" },
  { id: "il-6", title: "Citrus Study", medium: "Watercolour", palette: ["#FF9F1C", "#0FBFA6", "#FF5A47"], span: "sm" },
  { id: "il-7", title: "The Wanderer", medium: "Digital · Character", palette: ["#2D6BFF", "#7C4DFF", "#FF5A47"], span: "md" },
  { id: "il-8", title: "Warm Static", medium: "Mixed media", palette: ["#FF5A47", "#141210", "#FF9F1C"], span: "sm" },
  { id: "il-9", title: "Ocean Lines", medium: "Digital · Ink", palette: ["#0FBFA6", "#141210", "#2D6BFF"], span: "lg" },
  { id: "il-10", title: "Bloom Study", medium: "Gouache", palette: ["#FF5A47", "#FF9F1C", "#7C4DFF"], span: "sm" },
];

/* -------------------------------- Testimonials -------------------------------- */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  accent: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Dina didn't just design our brand — she understood it better than we did. Every touchpoint feels intentional and alive. Sales in our first month doubled our projection.",
    name: "Layla Hassan",
    role: "Founder, Maison Flora",
    accent: "#0FBFA6",
  },
  {
    quote: "Working with Dina was the smoothest creative process I've had. She turns fuzzy ideas into a system the whole team can actually use. The motion work is genuinely magic.",
    name: "Marcus Reid",
    role: "Head of Product, Nova",
    accent: "#2D6BFF",
  },
  {
    quote: "I joined the beginner class terrified of a blank page. Six weeks later I'm sketching every day. Dina teaches with so much patience and warmth — she makes it feel possible.",
    name: "Sofia Marín",
    role: "Drawing Course Student",
    accent: "#FF5A47",
  },
  {
    quote: "The illustrations for our children's book are beyond anything we imagined. Parents tell us their kids sleep with it. That's Dina's art doing the work.",
    name: "Daniel Osei",
    role: "Author, Wildwood Tales",
    accent: "#FF9F1C",
  },
];

/* ----------------------------------- Stats ------------------------------------ */
/* ----------------------------------- Stats ------------------------------------
 *
 * VERIFY BEFORE LAUNCH. Three of these four were invented for the
 * original placeholder build and only the first has been corrected
 * against the real CV.
 *
 * TODO(dina): confirm PROJECTS_DELIVERED. Count finished, shipped
 *   pieces across Al-Ahram, Artix Fofana, SMILE MAKERS and Everlast.
 * TODO(dina): confirm STUDENTS_TAUGHT. Count individual students,
 *   not sessions, across the drawing and painting classes.
 *
 * The fourth cell was 40+ Brands built. Against three years and four
 * employers that is not defensible, so it has been replaced with a
 * countable fact rather than inflated.
 * -------------------------------------------------------------------------- */
