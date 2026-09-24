import { useEffect, useState } from "react";
import type { Transition, Variants } from "framer-motion";

/* ------------------------------------------------------------------ *
 *  THE MOTION SYSTEM — two easings, two durations, one entrance.
 *
 *  These mirror the easing and duration tokens in tokens.css so that
 *  JS-driven motion (framer) and CSS-driven motion (hover, focus)
 *  stay in lockstep.
 * ------------------------------------------------------------------ */

/** Entrance. Everything that appears on scroll uses this and only this. */
export const EASE_ENTRANCE = [0.22, 1, 0.36, 1] as const;
export const DUR_ENTRANCE = 0.6;

/** Interaction. Hover, press, focus, state flips. */
export const EASE_UI = [0.4, 0, 0.2, 1] as const;
export const DUR_UI = 0.2;

/** Stagger between siblings in one group. */
export const STAGGER = 0.07;

/** Entrance travel. 20px, never more, never a scale or a rotate. */
export const ENTER_Y = 20;

/** Trigger point: an element begins its entrance once ~20% of it has
 *  entered the viewport. Expressed as a framer-motion root margin. */
export const IN_VIEW_MARGIN = "0px 0px -20% 0px";

export const enterTransition: Transition = {
  duration: DUR_ENTRANCE,
  ease: EASE_ENTRANCE,
};

export const uiTransition: Transition = {
  duration: DUR_UI,
  ease: EASE_UI,
};

/** The one entrance pattern. */
export const enterVariants: Variants = {
  hidden: { opacity: 0, y: ENTER_Y },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

/** Reduced-motion variant of the same: opacity only, no transform. */
export const enterVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR_ENTRANCE } },
};

export const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};

/* ------------------------------------------------------------------ *
 *  prefers-reduced-motion, as a live hook (it can change at runtime).
 *  Every parallax, pin, marquee and float in the site checks this.
 * ------------------------------------------------------------------ */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
