import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getProject, getAdjacent, projects } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Footer } from "@/components/sections/Footer";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Project page — THE template for every project. One dynamic route
 *  (/work/:slug in App.tsx) renders this for all of them; everything
 *  that differs per project (title, category, year, description,
 *  banner, gallery, image count, previous/next) comes from the data
 *  (src/data/portfolio.ts + src/data/projectNames.ts). Styling: `.case*`
 *  in index.css; the column is the site container (.container-wide),
 *  the same box the navbar pill sits in, so every edge lines up.
 *
 *  Nothing is cropped: the banner keeps its own aspect ratio (capped at
 *  72vh, letterboxed on a soft ground if it hits the cap) and the
 *  gallery is a CSS-columns masonry of natural-ratio images. The banner
 *  and every gallery image open one lightbox, which walks through all
 *  of the project's images.
 * ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  const adjacent = slug ? getAdjacent(slug) : null;
  const reduced = useReducedMotion();

  /* lightbox index into project.images: 0 = the banner */
  const [active, setActive] = useState<number | null>(null);
  /* one lightbox over every image: the banner, then the gallery */
  const images = project ? [project.banner, ...project.gallery] : [];
  const gallery = project ? project.gallery : [];

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: number) =>
      setActive((cur) =>
        cur === null ? cur : (cur + dir + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
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
  }, [active, close, go]);

  /* Swipe left / right in the lightbox. A horizontal drag of 50px or
     more changes image; anything shorter (or mostly vertical) is left
     alone, so a tap on the backdrop still closes it. */
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
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

  /* a new project closes any open lightbox */
  useEffect(() => setActive(null), [slug]);

  if (!project || !adjacent) return <Navigate to="/" replace />;
  const { prev, next, index } = adjacent;
  const cover = project.banner;

  return (
    <main id="main" data-surface="light" data-nav="light">
      <div className="case-sheet lift-off">
        <article className="case container-wide">
          <Reveal>
            <Link to="/work" className="case-back">
              <ArrowLeft size={16} aria-hidden="true" /> Back to work
            </Link>
          </Reveal>

          <header className="case-head">
            <Reveal>
              <Eyebrow>
                {project.category} · {project.year} · {pad(index + 1)} /{" "}
                {pad(projects.length)}
              </Eyebrow>
            </Reveal>
            <Reveal index={1}>
              <h1 className="case-title">{project.title}</h1>
            </Reveal>
            <Reveal index={2}>
              <p className="case-desc">{project.description}</p>
            </Reveal>
          </header>

          {/* banner — eager, the page's largest image */}
          <Reveal>
            <button
              type="button"
              onClick={() => setActive(0)}
              aria-label={`Open ${project.title}, image 1 of ${images.length}`}
              className="case-banner"
            >
              <img
                src={cover.src}
                alt={`${project.title} — cover`}
                width={cover.width ?? undefined}
                height={cover.height ?? undefined}
                decoding="async"
                className="case-banner__img"
              />
            </button>
          </Reveal>

          {gallery.length > 0 && (
            <section className="case-gallery" aria-labelledby="case-gallery-title">
              <div className="case-gallery__head">
                <h2 id="case-gallery-title" className="case-gallery__title">
                  Gallery
                </h2>
                <span className="case-gallery__count">
                  {gallery.length} image{gallery.length > 1 ? "s" : ""}
                </span>
              </div>

              <RevealGroup as="ul" className="case-masonry">
                {gallery.map((img, i) => (
                  <RevealItem as="li" key={img.src} className="case-masonry__item">
                    <button
                      type="button"
                      onClick={() => setActive(i + 1)}
                      aria-label={`Open ${project.title}, image ${i + 2} of ${images.length}`}
                      className="case-shot"
                    >
                      <img
                        src={img.src}
                        alt={`${project.title} — image ${i + 2}`}
                        width={img.width ?? undefined}
                        height={img.height ?? undefined}
                        loading="lazy"
                        decoding="async"
                        className="case-shot__img"
                      />
                    </button>
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          )}

          <nav aria-label="More projects" className="case-nav">
            <NavCard dir="prev" project={prev} />
            <NavCard dir="next" project={next} />
          </nav>
        </article>
      </div>

      <Footer />

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title}, image ${active + 1} of ${images.length}`}
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
            {images.length > 1 && (
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
              key={images[active].src}
              src={images[active].src}
              alt={`${project.title} — image ${active + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="case-lightbox__img"
            />
            <p className="case-lightbox__counter" aria-live="polite">
              {active + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
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
        "btn-icon absolute z-10 bg-palette-bg/10 text-palette-bg transition-colors duration-ui ease-ui hover:bg-palette-bg/20",
        className
      )}
    >
      {children}
    </button>
  );
}

/* Previous: ← · thumb · text.   Next: text · thumb · →. */
function NavCard({ dir, project }: { dir: "prev" | "next"; project: Project }) {
  const isNext = dir === "next";
  return (
    <Link
      to={`/work/${project.slug}`}
      className={cn("case-navcard", isNext && "case-navcard--next")}
    >
      {!isNext && (
        <ArrowLeft size={18} aria-hidden="true" className="case-navcard__arrow" />
      )}
      <img
        src={project.cover.src}
        alt=""
        aria-hidden="true"
        width={project.cover.width ?? undefined}
        height={project.cover.height ?? undefined}
        loading="lazy"
        className="case-navcard__thumb"
      />
      <span className="case-navcard__text">
        <span className="case-navcard__label">{isNext ? "Next" : "Previous"}</span>
        <span className="case-navcard__title">{project.title}</span>
        <span className="case-navcard__meta">{project.category}</span>
      </span>
      {isNext && (
        <ArrowRight size={18} aria-hidden="true" className="case-navcard__arrow" />
      )}
    </Link>
  );
}
