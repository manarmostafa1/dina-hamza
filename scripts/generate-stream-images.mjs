/* ------------------------------------------------------------------ *
 *  Builds the hero corridor's card images.
 *
 *  The corridor cards top out around 40cqw tall — ~770px on a 1920
 *  viewport — and they are in constant motion, so they never need the
 *  full-resolution paintings. Those stay untouched in /public for the
 *  gallery and case-study pages; this writes small, card-shaped
 *  derivatives to /public/stream/.
 *
 *  Output ratio 0.744 sits between the desktop card (18/25 = 0.72) and
 *  the mobile card (20/25 = 0.80), so object-cover trims only a sliver
 *  at either breakpoint.
 *
 *  Format is WebP with no JPEG fallback, deliberately. The component
 *  needs `container-type: inline-size` and `cqw` units, so it only runs
 *  on Chrome 105+ / Safari 16+ / Firefox 110+ — every one of which has
 *  shipped WebP for years. Any browser that can render the corridor at
 *  all can decode these, so a <picture> element would be dead weight.
 *
 *  Quality is 62, not a photographic 80+: every card is either small,
 *  moving, or both, and the corridor never holds one still long enough
 *  for the difference to be visible. That is ~35% of the bytes.
 *
 *  Two sizes, because the component takes one `src` per image and has
 *  no srcset. Hero.tsx already swaps props at the 768px breakpoint, so
 *  it swaps the image set there too.
 *
 *  Run: npm run generate:stream
 * ------------------------------------------------------------------ */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "stream");

/* Desktop card tops out ~40cqw tall = ~770px at 1920. Mobile card tops
   out ~156px tall at 390, ~470px at 3x DPR. */
const SIZES = [
  { dir: "", width: 640, height: 860 },
  { dir: "sm", width: 420, height: 564 },
];
const RATIO = 640 / 860;

/* Source → the ARTWORK BOX, as fractions [x0, y0, x1, y1] of the
   original.
 *
 * These are not aesthetic focal points, they are the edges of the
 * painting itself. Several of these files are photographs of a canvas
 * hanging on a wall above furniture, or standing on an easel, and
 * sharp's `attention` strategy happily framed the sofa. abstract-city
 * was ~45% living room; abstract-warm was ~70% room, lamp and couch.
 *
 * Six of the files also carry an Instagram carousel badge ("1/3",
 * "1/6", ...) burned into the top-right corner, and butterflies has the
 * profile avatar burned into the bottom-left. The boxes exclude those
 * too — that is why several stop short of 0.88 on x.
 *
 * The script fits the largest 0.744 portrait rectangle inside the box,
 * centred, so every card is filled edge to edge with painting. */
const SOURCES = [
  { file: "art-blue-eyes.jpg", box: [0.06, 0.03, 0.94, 0.97] },
  { file: "art-girl-doll.jpg", box: [0.0, 0.0, 1.0, 1.0] },
  { file: "art-butterflies.jpg", box: [0.05, 0.085, 0.84, 0.885] },
  { file: "art-pink-profile.jpg", box: [0.04, 0.03, 0.93, 0.92] },
  { file: "art-warm-hijab.jpg", box: [0.0, 0.0, 1.0, 1.0] },
  { file: "art-amazigh.jpg", box: [0.11, 0.02, 0.93, 0.84] },
  { file: "art-curly-bag.jpg", box: [0.005, 0.0, 0.995, 1.0] },
  { file: "art-deer.jpg", box: [0.32, 0.11, 0.94, 0.79] },
  { file: "art-pink-butterflies.jpg", box: [0.03, 0.075, 0.88, 0.95] },
  { file: "art-vintage-frame.jpg", box: [0.02, 0.035, 0.855, 0.96] },
  { file: "art-abstract-city.jpg", box: [0.05, 0.015, 0.87, 0.575] },
  /* art-abstract-warm.jpg and art-abstract-teal.jpg are both photographs
     of a canvas hanging above furniture: the painting is 9% and 12% of
     the frame respectively, so cropping to the artwork leaves ~345px of
     source for a 640px card — a 1.9x upscale that reads as mush next to
     eleven sharp ones. Excluded rather than shipped soft. Re-shoot them
     flat and they can come back. */
];

/** Largest RATIO-shaped rect that fits inside the artwork box, centred. */
function fitInside(box, meta) {
  const x0 = Math.round(box[0] * meta.width);
  const y0 = Math.round(box[1] * meta.height);
  const bw = Math.round((box[2] - box[0]) * meta.width);
  const bh = Math.round((box[3] - box[1]) * meta.height);
  let w = bw;
  let h = Math.round(w / RATIO);
  if (h > bh) {
    h = bh;
    w = Math.round(h * RATIO);
  }
  return {
    left: x0 + Math.round((bw - w) / 2),
    top: y0 + Math.round((bh - h) / 2),
    width: w,
    height: h,
  };
}

const totals = {};
const report = [];

for (const size of SIZES) {
  const dir = join(outDir, size.dir);
  mkdirSync(dir, { recursive: true });
  const key = size.dir || "lg";
  totals[key] = 0;

  for (const s of SOURCES) {
    const src = join(root, "public", s.file);
    const dst = join(dir, s.file.replace(/\.jpe?g$/i, ".webp"));
    const meta = await sharp(src).metadata();
    const rect = fitInside(s.box, meta);

    await sharp(src)
      .extract(rect)
      .resize(size.width, size.height, { fit: "cover", kernel: "lanczos3" })
      .webp({ quality: 62, effort: 6, smartSubsample: true })
      .toFile(dst);

    if (size.dir === "") {
      const up = (size.width / rect.width).toFixed(2);
      report.push(
        `  ${s.file.padEnd(26)} crop ${rect.width}x${rect.height}` +
          ` (${Math.round((rect.width * rect.height * 100) / (meta.width * meta.height))}% of frame)` +
          `  upscale ${up}x${Number(up) > 1.25 ? "  <-- soft" : ""}`
      );
    }

    totals[key] += statSync(dst).size;
  }
}

console.log(report.join("\n"));

const original = SOURCES.reduce(
  (n, s) => n + statSync(join(root, "public", s.file)).size,
  0
);

console.log(
  `[stream] ${SOURCES.length} cards · originals ${Math.round(
    original / 1024
  )}KB · ` +
    Object.entries(totals)
      .map(([k, v]) => `${k} ${Math.round(v / 1024)}KB`)
      .join(" · ")
);

writeFileSync(
  join(outDir, "MANIFEST.txt"),
  "Generated by scripts/generate-stream-images.mjs — do not edit.\n" +
    SIZES.map((s) => `${s.dir || "(root)"}: ${s.width}x${s.height}`).join("\n") +
    "\nWebP q62. Ratio 0.744.\n\n" +
    SOURCES.map((s) => s.file).join("\n") +
    "\n"
);
