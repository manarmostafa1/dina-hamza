/* ------------------------------------------------------------------ *
 *  Project display data — EDIT THESE.
 *
 *  Keyed by the project's folder in /public, so the values survive the
 *  auto-generation in scripts/generate-portfolio.mjs (which rebuilds
 *  portfolio.generated.ts from the folders and would overwrite anything
 *  typed there).
 *
 *    title        the name everywhere: cards, the project page, the
 *                 previous / next cards, and the browser tab
 *    featured     shown in the home page grid, in FEATURED_ORDER; every
 *                 project, featured or not, is listed on /work
 *    description  the project page copy, one string per paragraph,
 *                 always shown in full. **text** renders as bold.
 *
 *  Optional:
 *    category       replaces the generated category
 *    year           replaces the generated year; null = no year (the
 *                   eyebrow then shows just "category · NN / NN")
 *    bannerInGallery  the gallery lists every image, the banner too
 *                   (default: the gallery starts after the banner)
 *    cardImage      the image on the project's card (home grid, /work):
 *                   the URL of one of its images, as it appears in
 *                   portfolio.generated.ts (e.g. a square post, for a
 *                   cleaner card). Default: the banner.
 *
 *  A folder with no entry keeps its generated "Project NN" title and
 *  is not featured. Portfolio-6 and Portfolio-7 are part of
 *  Portfolio-15 (MERGE_INTO in the generator), so they have no entry.
 * ------------------------------------------------------------------ */
export type ProjectMeta = {
  title: string;
  featured: boolean;
  description: string[];
  category?: string;
  year?: string | null;
  bannerInGallery?: boolean;
  cardImage?: string;
};

export const projectMeta: Record<string, ProjectMeta> = {
  "Portfolio-1": {
    title: `Summer Glow Campaign 2026`,
    featured: true,
    description: [
      `A vibrant summer medical aesthetics campaign created for Everlast Wellness Medical Center, featuring promotional treatment packages and refreshing summer-inspired visuals. The campaign combines modern clinical aesthetics with a bright, engaging visual identity, designed to showcase beauty and wellness treatments across digital platforms.`,
    ],
  },
  "Portfolio-2": {
    title: `Medical Aesthetics Campaign For July Offers`,
    featured: true,
    description: [
      `A premium medical aesthetics campaign created for Everlast Wellness Medical Center, blending elegant visual storytelling with modern healthcare aesthetics. The campaign showcases personalized treatments and advanced wellness solutions through refined visuals, sophisticated compositions, and a cohesive luxury brand identity.`,
    ],
  },
  "Portfolio-3": {
    title: `Flash Sale Campaign`,
    featured: true,
    description: [
      `A promotional social media campaign created for Everlast Wellness Medical Center to highlight its Endolift treatment offers. The campaign combines a fresh medical-aesthetic visual direction with vibrant gradients, dynamic typography, lifestyle imagery, and promotional layouts designed to communicate the offers clearly while maintaining a premium brand presence.`,
    ],
  },
  "Portfolio-4": {
    title: `Social Media Campaign For November Offers`,
    featured: true,
    description: [
      `**Everlast Wellness Medical Center — Social Media Campaign**`,
      `A visual campaign developed for Everlast Wellness Medical Center, focusing on the intersection of medical expertise, aesthetics, and modern visual communication. Each design was crafted to present treatment information in an elegant and approachable way while maintaining a consistent and recognizable brand identity.`,
    ],
  },
  "Portfolio-5": {
    title: `White Friday — Beauty & Aesthetic Campaign`,
    featured: true,
    description: [
      `A premium White Friday campaign created for **Everlast Wellness Medical Center**, combining medical aesthetics with a modern, luxurious visual direction.`,
      `The campaign was designed to showcase exclusive treatment offers while maintaining Everlast’s professional medical identity through refined compositions, elegant visuals, bold typography, and a cohesive campaign look across social media.`,
    ],
  },
  "Portfolio-8": {
    title: `Golden Hours Campaign`,
    featured: true,
    description: [
      `A social media offers campaign for Everlast Wellness Medical Center, built around the idea of "Golden Hours": exclusive prices available only during set times of the day (8:00–11:00 AM and 8:00–11:00 PM). The series promotes treatments such as laser hair removal and body contouring in three-session packages at a special price, shown next to the original price. A clock in gold as the key visual reinforces the limited-time idea, while soft blue tones, flowing fabric, and elegant portraits keep the look calm and premium. Each post ends with clear contact details to make booking easy.`,
    ],
  },
  "Portfolio-9": {
    title: `Last Week of June Offers.`,
    featured: true,
    description: [
      `A limited-time social media campaign for Everlast Wellness Medical Center, built around the "June Crash Offer" and the "Last Week of June" promotion. The series covers treatments such as RF microneedling, PRP, dermal fillers, lip filler, skin boosters, and neurotoxin, with discounts of up to 60%, clear before-and-after pricing, and an extra 4% off through the app. The design uses bold blue tones and a "Crash Offer" badge for the main posts, and a dark navy and gold layout for the final-week price list, creating urgency while keeping every offer clear and easy to book.`,
    ],
  },
  "Portfolio-10": {
    title: `Everlast Eid Al Fitr Offers Campaign.`,
    featured: false,
    description: [
      `A festive social media campaign for Everlast Wellness Center, created for Eid Al Fitr. The series promotes a collection of skin and beauty bundles, including dermal fillers, deep cleansing, HydraFacial-style treatments, biostimulators, and collagen boosting. Each post highlights the bundle name, price before and after the discount, and an extra 4% off through the Everlast app. The design uses a deep navy and gold palette with crescent moons, stars, and lanterns, paired with elegant beauty portraits, to give the offers a warm Eid feeling while keeping them clear and easy to book.`,
    ],
  },
  "Portfolio-11": {
    title: `Everlast Wellness - AAD 2026 Carousel Campaign`,
    featured: false,
    description: [
      `A social media carousel campaign designed for Everlast Wellness, highlighting key insights and updates related to the AAD Annual Meeting 2026. The visual approach combines clean medical aesthetics, modern typography, and engaging storytelling to enhance audience interaction and information retention.`,
    ],
  },
  "Portfolio-12": {
    title: `EverLast Wellness | Print & Marketing Materials`,
    featured: false,
    description: [
      `A complete print collateral set promoting the Everlast Wellness App, including tri-fold brochures, flyers, and roll-up banners. The brochures and flyers use two visual directions: a soft pink and red look for women and a bold blue and dark look for men, each with its own photography and a QR code linking to the app. The roll-up banners tie the series together with the message "Wellness Made Simple" and highlight the app's key benefits: exclusive offers, 5% off bookings, AI skin analysis, and reward points. The result is one consistent print system that turns in-clinic visits into app downloads.`,
    ],
  },
  "Portfolio-13": {
    title: `Advertising campaign for an awareness program`,
    featured: false,
    description: [
      `MY Wellness MY Future is a social media awareness campaign . It uses real-life moments, such as exhaustion, stress, financial pressure, loneliness, and loss of purpose, to help people notice when something in their life feels out of balance. Each post asks a simple question in Arabic and highlights the key feeling in a green accent. The series ends with a wellness wheel showing the dimensions of a healthy life, inviting people to see health as more than the absence of illness. The visuals use a calm blue-and-green palette, cinematic photography, and a consistent brand look to keep the tone empathetic and encouraging.`,
    ],
  },
  "Portfolio-14": {
    title: `SkinTrix 360 - App Store Visual Design`,
    featured: true,
    description: [
      `SkinTrix 360 is an AI-powered skin analysis application designed to provide personalized skincare insights and recommendations. This project showcases the App Store promotional visuals, highlighting the app’s features, user experience, and modern healthcare-focused branding.`,
    ],
  },
  "Portfolio-15": {
    title: `10 Years Anniversary Branding`,
    featured: true,
    description: [
      `To celebrate Everlast’s 10th anniversary, we developed a comprehensive visual campaign that reflects the brand’s journey, achievements, and commitment to excellence over the past decade. The project included social media creatives, promotional materials, and anniversary-themed branding designed to create a memorable and cohesive celebration across all touchpoints.`,
    ],
  },
  /* public/travel — square (1:1) posts, listed after every Portfolio-N */
  travel: {
    title: `Social Media posts for travel company`,
    featured: false,
    category: `Social media`,
    year: null,
    bannerInGallery: true,
    description: [
      `A series of destination posts created for Book2Smile, a travel brand powered by Smile Makers, promoting trips to Paris, Kyoto, Lisbon, Thailand, Hawaii and Bali. Each post feels like a page from a travel scrapbook: torn-paper edges, layered photo prints and bold hand-lettered headlines invite people to discover each destination at a glance. A blue-to-purple frame, the same logo placement and a consistent "Powered by Smile Makers" signature keep the whole series instantly recognizable across the feed.`,
    ],
  },
};

/** The home page grid, in this order. Each of these has featured: true. */
export const FEATURED_ORDER: string[] = [
  "Portfolio-15",
  "Portfolio-1",
  "Portfolio-2",
  "Portfolio-3",
  "Portfolio-4",
  "Portfolio-5",
  "Portfolio-8",
  "Portfolio-9",
  "Portfolio-14",
];
