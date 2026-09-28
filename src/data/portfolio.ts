import {
  portfolioProjects,
  projectRedirects,
  type PortfolioImage,
  type PortfolioProject,
} from "./portfolio.generated";
import { FEATURED_ORDER, projectMeta } from "./projectNames";

/** A project as the site uses it. `banner` is the first image and
 *  `gallery` every image after it, so between them they hold all of the
 *  project's images (`images` still lists them all, in order).
 *  `description` is one string per paragraph; **text** marks bold. */
export type Project = Omit<PortfolioProject, "description"> & {
  featured: boolean;
  description: string[];
  banner: PortfolioImage;
  gallery: PortfolioImage[];
};
export type { PortfolioProject };

/** All projects, auto-generated from the public/Portfolio-* folders, with
 *  their display name, description and featured flag applied from
 *  projectNames.ts. Every count on the site is taken from this list. */
export const projects: Project[] = portfolioProjects.map((p) => {
  const meta = projectMeta[p.folder];
  return {
    ...p,
    title: meta?.title ?? p.title,
    featured: meta?.featured ?? false,
    description: meta?.description ?? (p.description ? [p.description] : []),
    banner: p.images[0] ?? p.cover,
    gallery: p.images.slice(1),
  };
});

/** The home page selection, in FEATURED_ORDER (projectNames.ts). A
 *  featured project missing from that list goes last, in data order. */
const rank = (p: Project) => {
  const i = FEATURED_ORDER.indexOf(p.folder);
  return i === -1 ? FEATURED_ORDER.length : i;
};
export const featuredProjects: Project[] = projects
  .filter((p) => p.featured)
  .sort((a, b) => rank(a) - rank(b));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The slug an old project URL now lives at (merged projects), if any. */
export function redirectFor(slug: string): string | undefined {
  return projectRedirects[slug];
}

/** Previous / next project, in data order, looping at both ends. */
export function getAdjacent(slug: string): {
  prev: Project;
  next: Project;
  index: number;
} | null {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const len = projects.length;
  return {
    index,
    prev: projects[(index - 1 + len) % len],
    next: projects[(index + 1) % len],
  };
}
