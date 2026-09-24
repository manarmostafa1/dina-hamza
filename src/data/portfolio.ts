import {
  portfolioProjects,
  type PortfolioImage,
  type PortfolioProject,
} from "./portfolio.generated";
import { projectMeta } from "./projectNames";

/** A project as the site uses it. `banner` is the first image and
 *  `gallery` every image after it, so between them they hold all of the
 *  folder's images (`images` still lists them all, in order). */
export type Project = PortfolioProject & {
  featured: boolean;
  banner: PortfolioImage;
  gallery: PortfolioImage[];
};
export type { PortfolioProject };

/** All projects, auto-generated from the public/Portfolio-* folders, with
 *  their display name and featured flag applied from projectNames.ts. */
export const projects: Project[] = portfolioProjects.map((p) => ({
  ...p,
  title: projectMeta[p.folder]?.title ?? p.title,
  featured: projectMeta[p.folder]?.featured ?? false,
  description: projectMeta[p.folder]?.description ?? p.description,
  banner: p.images[0] ?? p.cover,
  gallery: p.images.slice(1),
}));

/** The home page selection, in data order. */
export const featuredProjects: Project[] = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
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
