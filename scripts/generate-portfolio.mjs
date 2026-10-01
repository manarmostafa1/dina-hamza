/* ------------------------------------------------------------------ *
 *  Auto-generates the portfolio data by scanning public/Portfolio-*.
 *
 *  Each `Portfolio-N` folder becomes one project:
 *    · first image (natural sort)  → cover
 *    · all images                  → gallery / lightbox
 *
 *  Runs automatically via the `predev` / `prebuild` npm hooks, so any
 *  folder you add is picked up on the next `npm run dev` / `npm run build`
 *  with no code changes. Output: src/data/portfolio.generated.ts
 * ------------------------------------------------------------------ */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { imageSize } from "./imageSize.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const outFile = join(root, "src", "data", "portfolio.generated.ts");

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

/* Folders that are the same project as another one. Their images are
   appended to the target's, after its own (folder by folder, in the
   order listed; a byte-identical file already in the target is
   skipped), the folder is not listed as a project of its own, and its
   old URL redirects to the target (projectRedirects below). The
   folders stay in /public: the target's gallery serves the images
   from them. */
const MERGE_INTO = {
  "Portfolio-6": "Portfolio-15",
  "Portfolio-7": "Portfolio-15",
};

/* Project folders that don't follow the Portfolio-N naming, listed
   after all the Portfolio-N projects, in this order. Their files are
   taken in plain A→Z name order: the natural sort used for Portfolio-N
   ("img2" before "img10") reads hash-like names such as "0e92…" as the
   number 0 and scrambles them. `files` instead lists exactly which
   images, in which order — for a folder shared with other uses (the
   course photos in /teaching are not part of the project). File names
   must be lowercase with no spaces (they are URLs on a case-sensitive
   host). */
/* (public/teaching holds the course photos and the /courses page's
   photos — see src/data/courses.ts — not a project.) */
const EXTRA_FOLDERS = [{ folder: "travel" }];

/* Projects listed first, in this order; the rest keep their place after
   them. Only the order changes — slugs, categories and URLs don't. */
const LEAD_FOLDERS = ["Portfolio-15"];
const extra = (folder) => EXTRA_FOLDERS.find((e) => e.folder === folder);
const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// Placeholder primary categories cycled across projects — edit freely later.
// "Print" is intentionally excluded here: every project is surfaced under the
// Print filter (Dina's drawings & paintings) via the Projects section, so each
// card keeps a distinct primary category for the other filter tabs.
const CATEGORIES = [
  "Branding",
  "Social Media",
  "Packaging",
  "Illustration",
];

/**
 * Year for a project's metadata line.
 *
 * Preferred source is a YYYY-MM-DD in the source filename (the exports
 * carry their capture date); otherwise the file's mtime. This is real
 * data rather than an invented number — but if a project was actually
 * made in a different year, override it in PROJECT_YEARS below.
 */
const PROJECT_YEARS = {
  // "Portfolio-1": "2024",
};

function yearFor(folder, absFiles) {
  if (PROJECT_YEARS[folder]) return PROJECT_YEARS[folder];
  for (const f of absFiles) {
    const m = f.match(/(19|20)d{2}-d{2}-d{2}/);
    if (m) return m[0].slice(0, 4);
  }
  const times = absFiles.map((f) => {
    try {
      return statSync(f).mtimeMs;
    } catch {
      return Date.now();
    }
  });
  return String(new Date(Math.min(...times)).getFullYear());
}

/** Natural, case-insensitive sort so img2 < img10 and earlier timestamps win. */
const natCompare = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/** Build an encoded, absolute public URL for a file inside a project folder. */
const toUrl = (folder, file) =>
  `/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

const isDir = (name) => {
  try {
    return statSync(join(publicDir, name)).isDirectory();
  } catch {
    return false;
  }
};

function listPortfolioFolders() {
  const numbered = readdirSync(publicDir)
    .filter((name) => /^Portfolio-\d+$/i.test(name) && isDir(name))
    .sort(natCompare);
  return [...numbered, ...EXTRA_FOLDERS.map((e) => e.folder).filter(isDir)];
}

function buildProjects() {
  const folders = listPortfolioFolders();
  const projects = [];

  folders.forEach((folder, i) => {
    const num = Number(folder.match(/\d+/)?.[0] ?? i + 1);
    const present = readdirSync(join(publicDir, folder)).filter((f) => IMAGE_RE.test(f));
    const listed = extra(folder)?.files;
    for (const f of listed ?? []) {
      if (!present.includes(f)) console.warn(`[portfolio] ${folder}/${f} is listed but missing`);
    }
    const files = listed
      ? listed.filter((f) => present.includes(f))
      : present.sort(extra(folder) ? byName : natCompare);

    if (files.length === 0) return;

    const absFiles = files.map((f) => join(publicDir, folder, f));
    const images = files.map((f, idx) => {
      const size = imageSize(absFiles[idx]);
      return {
        src: toUrl(folder, f),
        width: size?.w ?? null,
        height: size?.h ?? null,
      };
    });
    const nn = String(num).padStart(2, "0");

    projects.push({
      /* file hashes, for the merge below; not written out */
      hashes: absFiles.map((f) =>
        createHash("sha1").update(readFileSync(f)).digest("hex")
      ),
      slug: folder.toLowerCase(),
      folder,
      title: `Project ${nn}`,
      category: CATEGORIES[i % CATEGORIES.length],
      year: yearFor(folder, absFiles),
      /* Real copy goes in src/data/projectNames.ts; an empty string
         hides the paragraph on the project page. */
      description: "",
      cover: images[0],
      images,
    });
  });

  /* Categories are assigned above, by each folder's place among all of
     them, so dropping the merged folders leaves every other project's
     category unchanged. */
  const redirects = {};
  for (const [from, to] of Object.entries(MERGE_INTO)) {
    const src = projects.find((p) => p.folder === from);
    const dst = projects.find((p) => p.folder === to);
    if (!src || !dst) {
      if (src || dst) console.warn(`[portfolio] merge ${from} → ${to}: folder missing, skipped`);
      continue;
    }
    src.images.forEach((img, i) => {
      if (dst.hashes.includes(src.hashes[i])) return;
      dst.images.push(img);
      dst.hashes.push(src.hashes[i]);
    });
    projects.splice(projects.indexOf(src), 1);
    redirects[src.slug] = dst.slug;
  }

  /* LEAD_FOLDERS to the front (after the categories were assigned, so
     they don't change) */
  const lead = LEAD_FOLDERS.map((f) => projects.find((p) => p.folder === f)).filter(Boolean);
  projects.splice(0, projects.length, ...lead, ...projects.filter((p) => !lead.includes(p)));

  return {
    projects: projects.map(({ hashes, ...p }) => p),
    redirects,
  };
}

function main() {
  const { projects, redirects } = buildProjects();

  const banner = `/* AUTO-GENERATED by scripts/generate-portfolio.mjs — do not edit by hand.\n * Run \`npm run dev\` or \`npm run build\` to regenerate after adding folders. */`;

  const body = `${banner}

export interface PortfolioImage {
  src: string;
  /** Intrinsic pixel size, read from the file header. */
  width: number | null;
  height: number | null;
}

export interface PortfolioProject {
  slug: string;
  folder: string;
  title: string;
  category: string;
  /** Derived from the source file dates — see yearFor() in the generator. */
  year: string;
  description: string;
  cover: PortfolioImage;
  images: PortfolioImage[];
}

export const portfolioProjects: PortfolioProject[] = ${JSON.stringify(
    projects,
    null,
    2
  )};

/** Old project URLs (merged folders, see MERGE_INTO in the generator)
 *  → the slug of the project they are now part of. */
export const projectRedirects: Record<string, string> = ${JSON.stringify(
    redirects,
    null,
    2
  )};
`;

  writeFileSync(outFile, body, "utf8");
  console.log(
    `[portfolio] generated ${projects.length} project(s) → src/data/portfolio.generated.ts`
  );
}

main();
