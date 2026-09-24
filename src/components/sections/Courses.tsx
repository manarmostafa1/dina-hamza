import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { scrollToId } from "@/components/shell/SmoothScroll";
import { useReducedMotion } from "@/lib/motion";
import {
  teachingCourses as courses,
  DEFAULT_COURSE,
  type TeachingCourse,
} from "@/data/teaching";

/* ------------------------------------------------------------------ *
 *  Teaching — an open sketchbook.
 *
 *      [01][02][03][04][05][06]      divider tabs (a WAI-ARIA tablist)
 *      ┌────────────┬─┬────────────┐
 *      │  artwork   │○│  the class │  left page · spiral · right page
 *      └────────────┴─┴────────────┘
 *
 *  Layout lives in the `.book*` rules in index.css. Switching class
 *  crossfades the artwork and lifts the right page's text 8px, 250ms;
 *  instant under prefers-reduced-motion.
 * ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");
const RINGS = 14;
const FADE = 0.25;

export function Courses() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(() =>
    Math.max(0, courses.findIndex((c) => c.id === DEFAULT_COURSE))
  );
  const course = courses[active];
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Keep the active tab in view when the row scrolls (< 1024px). Scrolls
     the row only — never the page. */
  useEffect(() => {
    const row = tabsRef.current;
    const tab = tabRefs.current[active];
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
    row.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const select = (i: number, focus = false) => {
    const n = (i + courses.length) % courses.length;
    setActive(n);
    if (focus) tabRefs.current[n]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: courses.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  const fade = reduced ? { duration: 0 } : { duration: FADE, ease: "easeOut" };

  return (
    <Section id="courses" surface="light">
      <SectionHeader
        eyebrow="Teaching"
        title="I teach the thing I love."
        accent="love"
        lead="Small, patient drawing and painting classes for children, teenagers and adults. Flip through the sketchbook to find your class."
      />

      <div className="book-wrap">
        {/* ---------- divider tabs ---------- */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Drawing and painting classes"
          className="book-tabs"
        >
          {courses.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`course-tab-${c.id}`}
              aria-selected={i === active}
              aria-controls="course-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onTabKey}
              className={`book-tab ${i % 2 ? "book-tab--apricot" : "book-tab--sage"}`}
            >
              <span className="book-tab__num">{pad(i + 1)}</span>
              {c.name}
            </button>
          ))}
        </div>

        {/* ---------- the book ---------- */}
        <div
          id="course-panel"
          role="tabpanel"
          aria-labelledby={`course-tab-${course.id}`}
          className="book"
        >
          {/* left page: the artwork */}
          <div className="book-page book-page--left">
            <div className="book-art">
              <AnimatePresence initial={false}>
                <motion.div
                  key={course.id}
                  className="book-art__layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                >
                  <Artwork course={course} />
                </motion.div>
              </AnimatePresence>
              <span aria-hidden="true" className="book-tape book-tape--apricot" />
              <span aria-hidden="true" className="book-tape book-tape--sage" />
            </div>
            <p className="book-caption">{course.caption}</p>
          </div>

          {/* spiral */}
          <div aria-hidden="true" className="book-spiral">
            {Array.from({ length: RINGS }, (_, i) => (
              <svg key={i} className="book-ring" viewBox="0 0 26 16">
                <ellipse cx="13" cy="8" rx="11" ry="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="3" cy="8" r="1.8" fill="currentColor" />
                <circle cx="23" cy="8" r="1.8" fill="currentColor" />
              </svg>
            ))}
          </div>

          {/* right page: the class */}
          <div className="book-page book-page--right">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={course.id}
                className="book-copy"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                transition={fade}
              >
                <div className="book-copy__top">
                  <p className="book-kicker">
                    Class {pad(active + 1)} of {pad(courses.length)}
                  </p>
                  <div className="book-title">
                    <h3 className="book-name">{course.name}</h3>
                    <svg aria-hidden="true" className="book-underline" viewBox="0 0 180 14">
                      <path
                        d="M3 9 C 40 3, 70 12, 104 7 S 160 4, 177 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className="book-desc">{course.description}</p>
                  <div className="book-skills">
                    <p className="book-skills__label">You'll practise</p>
                    <ul className="book-chips">
                      {course.skills.map((s) => (
                        <li key={s} className="book-chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="book-foot">
                  <div className="book-actions">
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId("contact");
                      }}
                      className="btn btn--lg bg-content-1 text-surface-1 transition-colors duration-ui ease-ui hover:bg-accent-fill hover:text-accent-contrast"
                    >
                      Book this class
                    </a>
                    <button
                      type="button"
                      onClick={() => select(active + 1)}
                      className="btn btn--lg border border-palette-muted-dark text-content-1 transition-colors duration-ui ease-ui hover:border-content-1"
                    >
                      Next page
                    </button>
                  </div>
                  <span className="book-folio">p. {pad(active + 1)}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Artwork({ course }: { course: TeachingCourse }) {
  const { art } = course;
  if (art.kind === "image") {
    return (
      <img
        src={art.src}
        alt={art.alt}
        loading="lazy"
        decoding="async"
        className="book-art__img"
        style={{ objectPosition: art.pos }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${course.caption} — artwork coming soon`}
      className={`book-art__img book-placeholder book-placeholder--${art.tone}`}
    >
      {art.icon === "pencil" ? <PencilSketchIcon /> : <TabletIcon />}
    </div>
  );
}

function PencilSketchIcon() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="book-placeholder__icon">
      <path d="M14 70 C 26 52, 40 78, 52 60 S 74 48, 82 62" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M58 18 L74 34 L40 68 L24 70 L26 54 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M52 24 L68 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="book-placeholder__icon">
      <rect x="16" y="14" width="52" height="68" rx="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M26 58 C 34 44, 44 62, 56 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 22 L86 28 L62 74 L56 76 L58 70 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
