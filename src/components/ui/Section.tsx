import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

/* ------------------------------------------------------------------ *
 *  Section — the only way a section gets a surface, a rhythm and a
 *  rounded lift.
 *
 *  SURFACE LOGIC (previously random light/dark alternation):
 *    light  = "the voice"  — hero, about, services, courses,
 *                            experience. Dina is speaking.
 *    dark   = "the work"   — projects, gallery, contact, footer.
 *                            The artwork, or the invitation, is on
 *                            display.
 *
 *  That produces three deliberate movements rather than a flicker:
 *    light overture → dark gallery → light chapter → dark close.
 *
 *  `lift` is applied ONLY at a surface change (the rounded shoulder is
 *  the punctuation between movements). Sections that share a surface
 *  with the one above them sit flush, which is what stops the corners
 *  from visibly peeling mid-run.
 * ------------------------------------------------------------------ */

export type Surface = "light" | "dark";

interface SectionProps {
  id?: string;
  surface?: Surface;
  /** Rounded shoulder + overlap. Use at surface changes only. */
  lift?: boolean;
  /** Reserve the shoulder radius for the lifted section below. */
  liftUnder?: boolean;
  /** Half rhythm. Unused: every section now shares one rhythm. */
  tight?: boolean;
  /** Section renders its own container; set false to go full-bleed. */
  contained?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  as?: "section" | "footer";
}

export function Section({
  id,
  surface = "light",
  lift = false,
  liftUnder = false,
  tight = false,
  contained = true,
  className,
  innerClassName,
  children,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      /* data-surface re-themes every colour token below this node.
         data-nav is read by the navbar's IntersectionObserver so the
         pill can invert over dark sections. */
      data-surface={surface}
      data-nav={surface}
      className={cn(
        "section",
        lift && "section--lift",
        liftUnder && "section--lift-under",
        tight && "py-section-tight",
        className
      )}
    >
      {contained ? (
        <div className={cn("container-wide relative", innerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}

export { Reveal, RevealGroup, RevealItem };
