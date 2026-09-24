import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Page scroll progress.
 *
 * Kept, but made subtle and put back inside the palette: it was a
 * 3px four-stop rainbow (coral → orange → purple → blue) that appeared
 * nowhere else in the design. It is now a 2px accent rule.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
