import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode, type TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  The image lightbox — the project pages and /courses. Styling:
 *  `.case-lightbox*` in index.css.
 *
 *  Controlled: `index` is the open image (null = closed) and
 *  `onIndex` changes it. Arrows and ← / → step through the images and
 *  loop; Escape, the × or a tap on the backdrop closes; a horizontal
 *  swipe of 50px or more changes image on touch. The page behind is
 *  locked while it is open. The image is contained in 90vw × 90vh,
 *  never cropped.
 * ------------------------------------------------------------------ */
export function Lightbox({
  images,
  index,
  onIndex,
  label,
}: {
  images: { src: string }[];
  index: number | null;
  onIndex: (i: number | null) => void;
  /** names the images: "{label}, image 3 of 5" */
  label: string;
}) {
  const reduced = useReducedMotion();
  const n = images.length;
  const close = useCallback(() => onIndex(null), [onIndex]);
  const go = useCallback(
    (dir: number) => {
      if (index !== null) onIndex((index + dir + n) % n);
    },
    [index, n, onIndex]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    /* lock the page behind the lightbox */
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, [index, close, go]);

  /* Swipe left / right. A horizontal drag of 50px or more changes image;
     anything shorter (or mostly vertical) is left alone, so a tap on the
     backdrop still closes it. */
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      e.preventDefault(); /* no click follows, so it doesn't close */
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <AnimatePresence>
      {index !== null && images[index] && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${label}, image ${index + 1} of ${n}`}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="case-lightbox"
        >
          <LightboxButton onClick={close} label="Close" className="case-lightbox__close">
            <X size={22} />
          </LightboxButton>
          {n > 1 && (
            <>
              <LightboxButton
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                label="Previous image"
                className="case-lightbox__prev"
              >
                <ChevronLeft size={24} />
              </LightboxButton>
              <LightboxButton
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                label="Next image"
                className="case-lightbox__next"
              >
                <ChevronRight size={24} />
              </LightboxButton>
            </>
          )}

          <img
            key={images[index].src}
            src={images[index].src}
            alt={`${label} — image ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="case-lightbox__img"
          />
          <p className="case-lightbox__counter" aria-live="polite">
            {index + 1} / {n}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LightboxButton({
  onClick,
  label,
  className,
  children,
}: {
  onClick: (e: MouseEvent) => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "btn-icon absolute z-10 bg-palette-bg/10 text-palette-bg transition-colors duration-ui ease-ui hover:bg-palette-bg/20",
        className
      )}
    >
      {children}
    </button>
  );
}
