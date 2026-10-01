import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Images } from "lucide-react";
import { useReducedMotion } from "@/lib/motion";
import type { Project } from "@/data/portfolio";
import { ContainImage } from "@/components/ui/ContainImage";

/* ------------------------------------------------------------------ *
 *  The project grid + card — shared by the home page's Featured
 *  projects section and the /work page. Styling: `.work-grid`,
 *  `.work-card` in index.css.
 *
 *  Every card is the same size (a 4:3 frame, 3 / 2 / 1 columns) and
 *  every image is whole: it is contained in the frame on a blurred copy
 *  of itself (ContainImage). The title (an → slides in after it on
 *  hover) and the image count sit under the frame. The category is data
 *  only — not shown. The image is the project's `card`
 *  (projectNames.ts cardImage), else its banner.
 *
 *  Entrance: cards rise 24px and fade in, 600ms ease-out, 60ms apart,
 *  the first time the grid enters view. Once. Nothing under reduced
 *  motion. Hover is CSS, limited to real pointers.
 * ------------------------------------------------------------------ */

const STAGGER = 0.06;
const ENTER_S = 0.6;

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  return (
    <motion.ul
      className="work-grid"
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ staggerChildren: STAGGER }}
    >
      {projects.map((p) => (
        <motion.li
          key={p.slug}
          className="work-item"
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
  const img = project.card;
  const n = project.images.length;
  return (
    <Link to={`/work/${project.slug}`} className="work-card">
      <ContainImage
        src={img.src}
        alt={project.title}
        width={img.width}
        height={img.height}
        className="work-card__frame"
      />

      <span className="work-card__info">
        <span className="work-card__name">
          <h3 className="work-card__title">{project.title}</h3>
          <ArrowRight size={16} aria-hidden="true" className="work-card__arrow" />
        </span>
        <span className="work-card__count">
          <Images size={14} aria-hidden="true" />
          {n}
          <span className="sr-only">{n === 1 ? " image" : " images"}</span>
        </span>
      </span>
    </Link>
  );
}
