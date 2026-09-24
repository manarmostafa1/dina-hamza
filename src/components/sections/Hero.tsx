import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import type { CorridorPath } from "@/components/ui/image-stream-hero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { scrollToId } from "@/components/shell/SmoothScroll";
import { streamImages, streamImagesSm } from "@/data/streamImages";
import {
  enterVariants,
  enterVariantsReduced,
  groupVariants,
  useReducedMotion,
} from "@/lib/motion";

/* ------------------------------------------------------------------ *
 *  CORRIDOR GEOMETRY
 *
 *  The component's docs warn that the ribbon only stays solid while
 *  consecutive cards overlap, and that raising `exitHeight`, dropping
 *  `cards` or pulling `railExit` in all push toward a tear. Those
 *  interactions were solved numerically, not by eye.
 *
 *  Note: because z = perspective * (1 - 1/scale), the projection factor
 *  P/(P - z) reduces to exactly `scale` — so `perspective` cancels out
 *  of the path entirely and only affects each card's own rotateY
 *  foreshortening. Overlap depends on cards, exitHeight/birthHeight,
 *  railExit, railBirth, fan, and the cardWidth/cardHeight ratio.
 *
 *  Solidity margin = min over u of
 *    scale(u+1/cards)·(rail(u+1/cards) − w/2) − scale(u)·(rail(u) + w/2)
 *  with w foreshortened by cos(turn). Negative means overlapping, i.e.
 *  solid. The component's shipped defaults score −0.03cqw — exactly on
 *  the boundary — which is what validates the model.
 * ------------------------------------------------------------------ */

const DESKTOP = {
  cards: 12,
  speed: 22,
  axis: 52,
  path: {
    exitHeight: 40, // cards leave before they can dominate the headline
    railExit: 46,
    fan: 3.3,
  } satisfies CorridorPath,
  // solidity −0.53cqw · inner edge 60.9cqw at death (needs ≥ 50)
};

/* MOBILE IS A DIFFERENT LAYOUT, NOT A SCALED ONE.
 *
 * Everything in the corridor is sized in cqw, so a phone gets a
 * pixel-perfect miniature of the desktop composition — but the copy
 * does NOT scale with it, so at 390px the headline occupies most of the
 * frame and lands right on the ribbon. A scrim strong enough to rescue
 * it erased the artwork completely, which makes the whole component
 * pointless on a phone.
 *
 * So the corridor gets its own band instead: on a phone the corridor
 * layer (.hero-stage) is taken out of its full-hero overlay and placed
 * in the flow directly under the copy, 74cqw tall (clamped 260–330px,
 * i.e. ~266 / 289 / 318px at 360 / 390 / 430). The axis is inside the
 * band, so where the gallery sits no longer depends on the screen's
 * height, and it can never reach up into the buttons.
 *
 * The geometry is fitted to that band, not scaled down from desktop:
 * cards grow to 66cqw on the way out (the band is 74cqw, so they stay
 * inside it), the walls turn 4° → 18° instead of 6° → 28° so the
 * paintings face the viewer, perspective is doubled (less rotation
 * foreshortening), and one card fewer per side keeps the throat from
 * crushing. Tallest card still fully on screen: 48.6cqw, ~190px at 390
 * (was 29.7cqw, 116px). Every length is cqw, so it follows the width on
 * resize by itself. */
const MOBILE = {
  cards: 6,
  speed: 22, // a card arrives every 3.7s, as before
  axis: 46, // in the band, not the hero; a little above its middle, so
  // the 66cqw exit cards meet its top edge (1cqw spare) and the painting
  // starts right under the buttons
  path: {
    perspective: 60,
    birthHeight: 3.5,
    exitHeight: 66,
    railExit: 29, // pulled in: the bigger cards reach the edge sooner
    fan: 1.1,
    cardWidth: 20, // 0.8 — the derivatives are 0.744
    turnBirth: 4,
    turnExit: 18,
  } satisfies CorridorPath,
  // solidity −2.03cqw · inner edge 51.5cqw at death (needs ≥ 50)
};

/** Matches the `md` breakpoint the rest of the site uses. */
function useIsMobile() {
  /* Resolved synchronously on the first render: the corridor mounts its
     cards immediately and we do not want a desktop-sized set painted
     and then swapped on a phone. */
  const [mobile, setMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767.98px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

export function Hero() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const cfg = mobile ? MOBILE : DESKTOP;
  const item = reduced ? enterVariantsReduced : enterVariants;

  return (
    <ImageStreamHero
      id="top"
      data-surface="light"
      data-nav="light"
      images={mobile ? streamImagesSm : streamImages}
      cards={cfg.cards}
      speed={cfg.speed}
      axis={cfg.axis}
      path={cfg.path}
      stageClassName="hero-stage"
      className="hero-stream bg-surface-1 text-content-1"
    >
      {/* Veil between the corridor and the copy — currently off at every
          size: tablet up uses the copy's own glow (.hero-copy), and on a
          phone the corridor is a band below the copy. */}
      <div aria-hidden="true" className="hero-scrim" />
      {/* Edge fade — dissolves the corridor into the page ground. */}
      <div aria-hidden="true" className="hero-edge" />

      {/* The copy. Tablet up: it fills the hero (flex-1) rather than
          setting its own height; top padding clears the fixed nav
          (--nav-total = nav height + its margin above and below) and the
          bottom padding matches it closely enough that the copy centres
          on the corridor's axis (52%). Phone: its own height, followed by
          the corridor band (.hero-content / .hero-stage in index.css). */}
      <motion.div
        variants={groupVariants}
        initial="hidden"
        animate="visible"
        /* Phone: its own height (flex-none) with the corridor band right
           after it; padding in .hero-content (index.css). Tablet up: fills
           the hero, vertically centred on the axis. */
        className="hero-content relative z-20 mx-auto flex w-full flex-none max-w-container flex-col items-center justify-start px-gutter text-center md:flex-1 md:justify-center md:pb-2xl md:pt-nav-total"
      >
        <div className="hero-copy flex flex-col items-center">
          <motion.div variants={item}>
            <Eyebrow>{`Portfolio ${new Date().getFullYear()} · Available for work`}</Eyebrow>
          </motion.div>

          <h1 className="h1 mt-sm flex max-w-[18ch] flex-col md:mt-md">
            <motion.span variants={item} className="hero-name block">
              Dina Hamza
            </motion.span>
            {/* Size, style, case and colour all come from the active
                theme — see .hero-sub in src/styles/themes.css. */}
            <motion.span variants={item} className="hero-sub mt-2xs block">
              designs that <span className="text-emph">stay</span> with you.
            </motion.span>
          </h1>

          <motion.p
            variants={item}
            className="mt-sm max-w-[46ch] text-body text-content-2 md:mt-md"
          >
            A multidisciplinary creative turning ideas into memorable visual
            experiences — from brand identities and illustration to the drawing
            classes I teach.
          </motion.p>

          <motion.div
            variants={item}
            className="hero-actions mt-md flex flex-wrap items-center justify-center gap-xs md:mt-lg"
          >
            <button
              onClick={() => scrollToId("work")}
              className="btn bg-content-1 text-surface-1 transition-colors duration-ui ease-ui hover:bg-accent-fill hover:text-accent-contrast"
            >
              View Portfolio
              <ArrowDownRight size={18} aria-hidden="true" />
            </button>
            {/* download + target=_blank: browsers that open PDFs instead of
                downloading (iOS Safari) show it in a new tab */}
            <a
              href="/dina-hamza-cv.pdf"
              download="Dina-Hamza-CV.pdf"
              target="_blank"
              rel="noopener"
              aria-label="Download Dina Hamza's CV (PDF)"
              className="hero-cv btn border border-edge bg-surface-1/70 text-content-1 backdrop-blur-sm transition-colors duration-ui ease-ui hover:bg-content-1 hover:text-surface-1"
            >
              Download CV
              <Download size={18} aria-hidden="true" className="hero-cv__icon" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </ImageStreamHero>
  );
}
