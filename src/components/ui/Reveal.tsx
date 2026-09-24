import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import {
  IN_VIEW_MARGIN,
  STAGGER,
  enterTransition,
  enterVariants,
  enterVariantsReduced,
  groupVariants,
  useReducedMotion,
} from "@/lib/motion";

/* ------------------------------------------------------------------ *
 *  THE entrance. 20px rise + opacity fade, 600ms, one easing,
 *  triggered once ~20% of the element has entered the viewport.
 *
 *  There is no scale-in, rotate-in, blur-in, mask-rise or per-word
 *  variant anywhere else in the codebase — if something needs to
 *  appear, it appears through this component.
 *
 *  Under prefers-reduced-motion the transform is dropped entirely and
 *  only the opacity fade survives.
 * ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode;
  /** Index within a group — multiplies the 70ms stagger. */
  index?: number;
  className?: string;
  as?: "div" | "li" | "figure" | "span";
}

export function Reveal({
  children,
  index = 0,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      ref={ref as never}
      className={className}
      variants={reduced ? enterVariantsReduced : enterVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ ...enterTransition, delay: index * STAGGER }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 *  RevealGroup / RevealItem — same entrance, staggered by 70ms, with
 *  one IntersectionObserver for the whole group instead of one per
 *  child.
 *
 *  The observer is always bound to the *static* wrapper. Binding it to
 *  an element that is itself being transformed makes the observed box
 *  move out from under the observer and the entrance mis-fires.
 * ------------------------------------------------------------------ */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });
  const Tag = motion[as];

  return (
    <Tag
      ref={ref as never}
      className={className}
      variants={groupVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "figure" | "span";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      variants={reduced ? enterVariantsReduced : enterVariants}
      className={className}
    >
      {children}
    </Tag>
  );
}
