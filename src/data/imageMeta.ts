/* ------------------------------------------------------------------ *
 *  Intrinsic pixel dimensions for the standalone artwork in /public.
 *
 *  Read straight out of the JPEG headers. Every <img> in the site gets
 *  a real width/height pair so the browser can reserve the box before
 *  the file arrives — without these, each unloaded image was a 0-height
 *  box and the whole page re-flowed as they streamed in.
 * ------------------------------------------------------------------ */
export const imageMeta: Record<string, { w: number; h: number }> = {
  "/art-abstract-city.jpg": { w: 1155, h: 1478 },
  "/art-abstract-teal.jpg": { w: 1175, h: 1472 },
  "/art-abstract-warm.jpg": { w: 1179, h: 1469 },
  "/art-amazigh.jpg": { w: 960, h: 1280 },
  "/art-blue-eyes.jpg": { w: 698, h: 960 },
  "/art-butterflies.jpg": { w: 1170, h: 1475 },
  "/art-curly-bag.jpg": { w: 941, h: 1280 },
  "/art-deer.jpg": { w: 960, h: 1280 },
  "/art-girl-doll.jpg": { w: 1179, h: 1431 },
  "/art-pink-butterflies.jpg": { w: 1085, h: 1455 },
  "/art-pink-profile.jpg": { w: 970, h: 1410 },
  "/art-vintage-frame.jpg": { w: 1175, h: 1442 },
  "/art-warm-hijab.jpg": { w: 1175, h: 1473 },
  "/dina-about.jpg": { w: 1157, h: 1479 },
  "/dina-holding.jpg": { w: 1166, h: 1471 },
  "/dina-studio.jpg": { w: 1179, h: 1554 },
  "/drawing-process.jpg": { w: 960, h: 1280 },
  "/services/identity-tall.webp": { w: 840, h: 1494 },
  "/about/showcase-dina.webp": { w: 752, h: 752 },
};

/** Fallback keeps the aspect ratio sane for anything not listed. */
export function dims(src: string) {
  return imageMeta[src] ?? { w: 1000, h: 1300 };
}
