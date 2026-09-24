import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Images } from "lucide-react";
import { useReducedMotion } from "@/lib/motion";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  The project grid + card — shared by the home page's Featured
 *  projects section and the /work page. Styling: `.work-grid`,
 *  `.work-card` in index.css.
 *
 *    layout="feature"  first card is a 2x2 feature, the rest 4:3
 *                      (grid-auto-flow: dense back-fills around it)
 *    layout="uniform"  every card 4:3, 3 / 2 / 1 columns
 *
 *  Entrance: cards rise 24px and fade in, 600ms ease-out, 60ms apart,
 *  the first time the grid enters view. Once. Nothing under reduced
 *  motion. Hover is CSS, limited to real pointers.
 * ------------------------------------------------------------------ */

const STAGGER = 0.06;
const ENTER_S = 0.6;

export function ProjectGrid({
  projects,
  layout = "feature",
}: {
  projects: Project[];
  layout?: "feature" | "uniform";
}) {
  const reduced = useReducedMotion();
  return (
    <motion.ul
      className={cn("work-grid", layout === "uniform" && "work-grid--uniform")}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ staggerChildren: STAGGER }}
    >
      {projects.map((p, i) => (
        <motion.li
          key={p.slug}
          className={cn(
            "work-item",
            layout === "feature" && i === 0 && "work-item--featured"
          )}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: ENTER_S, ease: "easeOut" },
            },
          }}
        >
          <ProjectCard project={p} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/work/${project.slug}`} className="work-card">
      <img
        src={project.cover.src}
        alt={`${project.title} — ${project.category}`}
        width={project.cover.width ?? undefined}
        height={project.cover.height ?? undefined}
        loading="lazy"
        decoding="async"
        className="work-card__img"
      />
      <span aria-hidden="true" className="work-card__shade" />
      <span aria-hidden="true" className="work-card__shade--hover" />

      {project.images.length > 1 && (
        <span className="work-card__count">
          <Images size={12} aria-hidden="true" />
          {project.images.length}
          <span className="sr-only">images</span>
        </span>
      )}

      <div className="work-card__body">
        <h3 className="work-card__title">{project.title}</h3>
        <p className="work-card__meta">{project.category}</p>
      </div>

      <span aria-hidden="true" className="work-card__arrow">
        <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}
