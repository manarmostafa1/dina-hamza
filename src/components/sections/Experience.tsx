import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReducedMotion } from "@/lib/motion";
import {
  chapters,
  education,
  journeyLead,
  type Chapter,
} from "@/data/journey";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  THE ROAD HERE — a pencil-drawn road, oldest chapter first.
 *
 *  ≥1024px  horizontal: years row · road · content row, all on one
 *           4-column grid so the columns line up. The road is an SVG
 *           measured to the grid's width; a dot marks the start of each
 *           column and a pencil sits at the end of the line, tip on it.
 *  <1024px  vertical: the road runs down the left edge, a dot at each
 *           chapter's year, the pencil at the bottom pointing up.
 *
 *  Entrance (once): the line draws itself (1.6s ease-in-out), the pencil
 *  travels with the line's end and each dot pops as the line reaches
 *  it. prefers-reduced-motion shows the finished drawing.
 * ------------------------------------------------------------------ */

const DRAW_S = 1.6;
const EASE: [number, number, number, number] = [0.42, 0, 0.58, 1]; // easeInOut
const COL_GAP = 20;
const DOT = 7; // past-dot radius (14px)
const PENCIL = 128; // pencil length, tip → eraser
const PENCIL_OVERHANG = 24; // how far it may run past the grid, into the gutter

/** Time (0-1) at which an ease-in-out tween reaches progress `p`. */
function timeAt(p: number) {
  const [x1, y1, x2, y2] = EASE;
  const bez = (t: number, a: number, b: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  // find t where y(t) = p, then return x(t)
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, y1, y2) < p) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, x1, x2);
}

/** A slightly wavy hand-drawn line from a to b along one axis. */
function wavy(from: number, to: number, cross: number, seed = 0) {
  const pts: string[] = [];
  const steps = Math.max(2, Math.round((to - from) / 8));
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    const d =
      1.8 * Math.sin(a / 57 + seed) + 0.9 * Math.sin(a / 19 + seed * 2);
    pts.push(`${a.toFixed(1)},${(cross + d).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function useIsDesktop() {
  const q = "(min-width: 1024px)";
  const [m, setM] = useState(
    () => typeof window !== "undefined" && window.matchMedia(q).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

export function Experience() {
  const desktop = useIsDesktop();
  return (
    <Section id="experience" surface="light" liftUnder className="road-section">
      <SectionHeader
        eyebrow="Journey"
        title="The road here."
        accent="here"
        lead={journeyLead}
      />
      {desktop ? <RoadHorizontal /> : <RoadVertical />}

      <p className="road-edu">
        <span className="road-edu__label">Education</span>
        <span className="road-edu__degree">{education.degree}</span>
        <span className="road-edu__school">{education.school}</span>
      </p>
    </Section>
  );
}

/* ================================================================== */

function Year({ ch }: { ch: Chapter }) {
  return (
    <div className={cn("road-year", ch.current && "road-year--now")}>
      <span className="road-year__num">{ch.year}</span>
      <span className="road-year__range">
        {ch.range}
        {ch.current && <span className="road-now">Now</span>}
      </span>
    </div>
  );
}

function Content({ ch, index }: { ch: Chapter; index: number }) {
  return (
    <div className={cn("road-content", ch.current && "road-content--now")}>
      <p className="road-label">Chapter {String(index + 1).padStart(2, "0")}</p>
      <div className="road-content__text">
        <h3 className="road-role">{ch.role}</h3>
        <p className="road-company">{ch.company}</p>
      </div>
      <p className="road-desc">{ch.description}</p>
    </div>
  );
}

/* ---------------- the drawing, shared by both orientations ---------------- */

function RoadSvg({
  length,
  cross,
  dots,
  vertical,
  play,
  reduced,
}: {
  length: number; // along-axis size of the drawing area
  cross: number; // cross-axis position of the line
  dots: { at: number; current?: boolean }[];
  vertical: boolean;
  play: boolean;
  reduced: boolean;
}) {
  if (!length || !dots.length) return null;
  const start = dots[0].at;
  const end = length - PENCIL + PENCIL_OVERHANG * (vertical ? 0 : 1);
  const mainD = wavy(start, end, cross, 1);
  const sketchD = wavy(start, start + (end - start) / 2, cross + 2.2, 4);
  /* swap x/y for the vertical road */
  const d = (path: string) =>
    vertical
      ? path.replace(/([\d.]+),([\d.]+)/g, (_, a, b) => `${b},${a}`)
      : path;

  const drawn = reduced || !play ? (reduced ? 1 : 0) : 1;
  const tr = (delay = 0) =>
    reduced ? { duration: 0 } : { duration: DRAW_S, ease: EASE, delay };
  const pencilFrom = start - end; // pencil rides from the first dot to the end
  const pencilAt = reduced ? 0 : play ? 0 : pencilFrom;

  return (
    <svg
      aria-hidden="true"
      className="road-svg"
      width={vertical ? cross * 2 + 20 : length}
      height={vertical ? length : cross * 2}
      overflow="visible"
    >
      <motion.path
        d={d(sketchD)}
        className="road-line road-line--sketch"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: drawn }}
        transition={tr()}
      />
      <motion.path
        d={d(mainD)}
        className="road-line"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: drawn }}
        transition={tr()}
      />

      {dots.map((dot, i) => {
        const p = (dot.at - start) / (end - start);
        const delay = reduced ? 0 : timeAt(Math.min(1, Math.max(0, p))) * DRAW_S;
        const [cx, cy] = vertical ? [cross, dot.at] : [dot.at, cross];
        const shown = reduced || play;
        return (
          <motion.g
            key={i}
            style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }}
            initial={{ scale: reduced ? 1 : 0 }}
            animate={{ scale: shown ? 1 : 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 18, delay }
            }
          >
            {dot.current ? (
              <>
                <circle cx={cx} cy={cy} r={14} className="road-dot-halo" />
                <circle cx={cx} cy={cy} r={DOT} className="road-dot road-dot--now" />
              </>
            ) : (
              <circle cx={cx} cy={cy} r={DOT} className="road-dot" />
            )}
          </motion.g>
        );
      })}

      {/* the pencil: tip at the line's end, pointing back along it */}
      <motion.g
        initial={
          reduced ? false : vertical ? { y: pencilFrom } : { x: pencilFrom }
        }
        animate={vertical ? { y: pencilAt } : { x: pencilAt }}
        transition={tr()}
      >
        <g
          transform={
            vertical
              ? `translate(${cross} ${end}) rotate(90)`
              : `translate(${end} ${cross})`
          }
        >
          <Pencil />
        </g>
      </motion.g>
    </svg>
  );
}

/** Pencil pointing LEFT, tip at (0,0), 128px long. */
function Pencil() {
  return (
    <g className="pencil" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="0,0 22,-8 22,8" className="pencil__wood" />
      <polygon points="0,0 7,-2.6 7,2.6" className="pencil__tip" />
      <rect x="22" y="-8" width="76" height="16" className="pencil__body" />
      <line x1="22" y1="-2.7" x2="98" y2="-2.7" className="pencil__groove" />
      <line x1="22" y1="2.7" x2="98" y2="2.7" className="pencil__groove" />
      <rect x="98" y="-8.5" width="14" height="17" className="pencil__ferrule" />
      <line x1="102.5" y1="-8.5" x2="102.5" y2="8.5" className="pencil__band" />
      <line x1="107.5" y1="-8.5" x2="107.5" y2="8.5" className="pencil__band" />
      <rect x="112" y="-8" width="16" height="16" rx="3" className="pencil__eraser" />
    </g>
  );
}

/* ---------------- horizontal (≥1024) ---------------- */

function RoadHorizontal() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const play = useInView(wrap, { once: true, amount: 0.35 });
  const [w, setW] = useState(0);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const col = (w - COL_GAP * (chapters.length - 1)) / chapters.length;
  const dots = chapters.map((ch, i) => ({
    at: i * (col + COL_GAP) + DOT + 1,
    current: ch.current,
  }));

  return (
    <div ref={wrap} className="road road--h">
      <div aria-hidden="true" className="road-grid">
        {chapters.map((ch) => (
          <Year key={ch.year} ch={ch} />
        ))}
      </div>
      <div ref={track} className="road-track">
        <RoadSvg
          length={w}
          cross={15}
          dots={dots}
          vertical={false}
          play={play}
          reduced={reduced}
        />
      </div>
      <ol className="road-grid road-list">
        {chapters.map((ch, i) => (
          <li key={ch.year}>
            <span className="sr-only">
              {ch.range}
              {ch.current ? ", current" : ""}.{" "}
            </span>
            <Content ch={ch} index={i} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- vertical (<1024) ---------------- */

function RoadVertical() {
  const reduced = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const play = useInView(list, { once: true, amount: 0.15 });
  const [geo, setGeo] = useState<{ h: number; dots: number[] }>({ h: 0, dots: [] });

  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const measure = () => {
      const top = el.getBoundingClientRect().top;
      const dots = [...el.querySelectorAll<HTMLElement>(".road-year__num")].map(
        (n) => {
          const r = n.getBoundingClientRect();
          return r.top - top + r.height / 2;
        }
      );
      setGeo({ h: el.offsetHeight, dots });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="road road--v">
      <div className="road-v-svg">
        <RoadSvg
          length={geo.h}
          cross={12}
          dots={geo.dots.map((at, i) => ({ at, current: chapters[i]?.current }))}
          vertical
          play={play}
          reduced={reduced}
        />
      </div>
      <ol ref={list} className="road-list road-list--v">
        {chapters.map((ch, i) => (
          <li key={ch.year} className="road-item">
            <Year ch={ch} />
            <Content ch={ch} index={i} />
          </li>
        ))}
      </ol>
    </div>
  );
}
