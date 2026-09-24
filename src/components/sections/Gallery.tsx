import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DUR_UI, EASE_UI, useReducedMotion } from "@/lib/motion";
import { artwork } from "@/data/artwork";
import { dims } from "@/data/imageMeta";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  THE PINNED EXHIBITION
 *
 *  Pinning is done with `position: sticky`, not by intercepting wheel
 *  events — the page keeps scrolling at exactly its normal rate, the
 *  track just translates while the stage is stuck. That is why it can
 *  no longer feel "stuck and slow", and why it releases cleanly at both
 *  ends instead of having to be scrolled out of.
 *
 *  Ratio: the section is exactly `stage height + overflow width` tall,
 *  so one viewport of vertical scroll moves one viewport of artwork —
 *  roughly two and a half cards. No multiplier, no easing curve on the
 *  mapping, nothing that fights the user's own scroll speed.
 *
 *  Below `lg`, and whenever prefers-reduced-motion is set, the pin is
 *  dropped entirely for a native snap carousel.
 * ------------------------------------------------------------------ */

function usePinnable() {
  const reduced = useReducedMotion();
  /* Resolved synchronously on the first render, not in an effect.
     useScroll captures its target element during the first layout
     pass; if the pinned branch is not in the tree yet the ref is null
     and framer silently falls back to tracking the whole document —
     which stretched the track's 1:1 mapping across the entire page and
     made the gallery feel like it would never end. */
  const [wide, setWide] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return wide && !reduced;
}

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const pinned = usePinnable();

  const pinWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  /* How far the track must travel for its last card to come flush with
     the right gutter. Measured, never guessed. */
  useLayoutEffect(() => {
    if (!pinned) {
      setDistance(0);
      return;
    }
    const measure = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      setDistance(Math.max(0, track.scrollWidth - stage.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  /* Bound to the pin wrapper, whose height is exactly one viewport
     plus the horizontal overflow — so progress 0→1 maps 1:1 onto the
     track's travel. No multiplier anywhere. */
  const { scrollYProgress } = useScroll({
    target: pinWrapRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  /* ---------------- lightbox ---------------- */
  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: number) =>
      setActive((cur) =>
        cur === null ? cur : (cur + dir + artwork.length) % artwork.length
      ),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, go]);

  const cards = artwork.map((art, i) => (
    <GalleryCard key={art.id} index={i} onOpen={() => setActive(i)} />
  ));

  return (
    <>
      <section
        id="gallery"
        data-surface="dark"
        data-nav="dark"
        className="gallery-pin gallery-panel section relative"
      >
        <div className="container-wide">
          <SectionHeader
            eyebrow="Gallery"
            title="From my sketchbook."
            accent="sketchbook"
            lead="Original drawings and paintings, personal work beyond the client projects. Drag to walk the exhibition."
            tone="dark"
          />
        </div>

        {pinned ? (
          /* ---------------- pinned track ----------------
             The wrapper is one viewport tall plus the overflow; the
             stage inside it is sticky. Nothing intercepts the wheel. */
          <div
            ref={pinWrapRef}
            style={{ height: `calc(100svh + ${distance}px)` }}
          >
            <div ref={stageRef} className="gallery-stage">
              <motion.div
                ref={trackRef}
                style={{ x }}
                /* Leading and trailing gutter are part of the track, so
                   the first card starts inside the viewport and the last
                   one ends inside it. Neither is ever clipped. */
                className="flex w-max items-center gap-md px-gutter"
              >
                {cards}
                <EndCap />
              </motion.div>

              <ProgressRail progress={scrollYProgress} />
            </div>
          </div>
        ) : (
          /* ---------------- native carousel ---------------- */
          <div>
            <div
              ref={railRef}
              tabIndex={0}
              role="region"
              aria-label="Artwork carousel — scroll horizontally"
              className="no-scrollbar flex snap-x snap-mandatory gap-md overflow-x-auto px-gutter pb-md"
            >
              {cards}
              <EndCap />
            </div>
            <div className="container-wide mt-sm flex justify-end gap-2xs">
              <RailButton rail={railRef} dir={-1} />
              <RailButton rail={railRef} dir={1} />
            </div>
          </div>
        )}
      </section>

      <Lightbox
        active={active}
        onClose={close}
        onGo={go}
      />
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  One card recipe. Every card: same width, same 4:5 image, same
 *  caption bar height. No "featured" variant — that variant is exactly
 *  what made the first card taller than the rest.
 * ------------------------------------------------------------------ */
function GalleryCard({ index, onOpen }: { index: number; onOpen: () => void }) {
  const art = artwork[index];
  const { w, h } = dims(art.src);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="gallery-card group snap-center text-left transition-transform duration-ui ease-ui hover:-translate-y-3xs"
    >
      {/* aspect-ratio-locked box; the image fills it completely.
          The black band above each image came from a fixed card height
          with an image that had neither height:100% nor object-fit. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-3">
        <img
          src={art.src}
          alt={`${art.title} — ${art.medium} by Dina Hamza`}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          style={{
            objectPosition: art.focal ?? "center",
            transform: art.scale ? `scale(${art.scale})` : undefined,
            transformOrigin: art.focal ?? "center",
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="gallery-card__caption">
        <span className="min-w-0">
          <span className="h3 block truncate">
            {art.title}
          </span>
          <span className="meta block truncate">
            {art.medium}
          </span>
        </span>
        <span className="text-small tabular-nums text-content-3">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}

function EndCap() {
  return (
    <div className="gallery-card grid place-items-center border-dashed bg-transparent">
      <p className="p-md text-center text-small text-content-3">
        {artwork.length} original
        <br />
        pieces
      </p>
    </div>
  );
}

/** Subtle, palette-matched, and the only position indicator. */
function ProgressRail({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  return (
    <div className="container-wide">
      <div
        className="h-px w-full overflow-hidden bg-edge"
        role="presentation"
      >
        <motion.div
          className="h-full origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      </div>
    </div>
  );
}

function RailButton({
  rail,
  dir,
}: {
  rail: React.RefObject<HTMLDivElement>;
  dir: number;
}) {
  return (
    <button
      type="button"
      aria-label={dir < 0 ? "Scroll left" : "Scroll right"}
      onClick={() =>
        rail.current?.scrollBy({
          left: dir * rail.current.clientWidth * 0.8,
          behavior: "smooth",
        })
      }
      className="btn-icon border border-edge text-accent transition-colors duration-ui ease-ui hover:bg-content-1 hover:text-surface-1"
    >
      {dir < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
function Lightbox({
  active,
  onClose,
  onGo,
}: {
  active: number | null;
  onClose: () => void;
  onGo: (dir: number) => void;
}) {
  return (
    <AnimatePresence>
      {active !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${artwork[active].title}, artwork ${active + 1} of ${
            artwork.length
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR_UI, ease: EASE_UI }}
          onClick={onClose}
          data-surface="dark"
          className="fixed inset-0 z-[9995] flex items-center justify-center bg-palette-ink/95 p-sm backdrop-blur-2xl md:p-xl"
        >
          <LightboxButton onClick={onClose} label="Close" className="right-sm top-sm">
            <X size={22} />
          </LightboxButton>
          <LightboxButton
            onClick={(e) => {
              e.stopPropagation();
              onGo(-1);
            }}
            label="Previous artwork"
            className="left-sm top-1/2 -translate-y-1/2"
          >
            <ChevronLeft size={24} />
          </LightboxButton>
          <LightboxButton
            onClick={(e) => {
              e.stopPropagation();
              onGo(1);
            }}
            label="Next artwork"
            className="right-sm top-1/2 -translate-y-1/2 md:right-sm"
          >
            <ChevronRight size={24} />
          </LightboxButton>

          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full flex-col items-center"
          >
            <img
              src={artwork[active].src}
              alt={`${artwork[active].title} — ${artwork[active].medium} by Dina Hamza`}
              className="max-h-[78svh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-sm flex w-full items-center justify-between gap-md text-palette-bg">
              <span>
                <span className="h3 block text-palette-bg">
                  {artwork[active].title}
                </span>
                <span className="meta block text-palette-muted-dark">
                  {artwork[active].medium}
                </span>
              </span>
              <span className="text-small tabular-nums text-palette-muted-dark">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(artwork.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
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
  onClick: (e: React.MouseEvent) => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "btn-icon absolute z-10 bg-palette-bg/10 text-palette-apricot transition-colors duration-ui ease-ui hover:bg-palette-bg/20",
        className
      )}
    >
      {children}
    </button>
  );
}
