import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DUR_ENTRANCE, EASE_ENTRANCE, useReducedMotion } from "@/lib/motion";

/**
 * Intro overlay.
 *
 * The exit was a full-height `y: -100%` wipe on its own easing curve —
 * a third motion pattern competing with the two the rest of the site
 * uses. It is now the same opacity fade on the same entrance easing,
 * and it is skipped outright under prefers-reduced-motion.
 */
export function Loader() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const DURATION = 1200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-surface-1"
          exit={{ opacity: 0 }}
          transition={{ duration: DUR_ENTRANCE, ease: EASE_ENTRANCE }}
        >
          <div className="text-center">
            <Eyebrow>Portfolio</Eyebrow>
            <p className="mt-md font-display text-display">Dina Hamza</p>
          </div>

          <div className="absolute inset-x-0 bottom-2xl px-gutter">
            <div className="mx-auto flex max-w-container items-end justify-between">
              <span className="text-small text-content-3">
                Graphic Designer · Visual Artist
              </span>
              <span className="font-display text-h2 tabular-nums">
                {count}
                <span className="text-accent">%</span>
              </span>
            </div>
            <div className="mt-sm h-px w-full overflow-hidden bg-edge">
              <div
                className="h-full origin-left bg-content-1"
                style={{ transform: `scaleX(${count / 100})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
