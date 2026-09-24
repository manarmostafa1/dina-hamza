import type { MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { scrollToId } from "@/components/shell/SmoothScroll";
import { useReducedMotion } from "@/lib/motion";
import { dims } from "@/data/imageMeta";

/* ------------------------------------------------------------------ *
 *  About — "Designer by craft, artist at heart."
 *
 *  Two halves of one practice: a sage panel (the designer) and an
 *  apricot panel (the artist), with a taped polaroid of Dina bridging
 *  them. Layout and breakpoints live in the `.about*` / `.polaroid*`
 *  rules in index.css; this file is content only.
 *
 *  Motion: exactly one reveal. The polaroid drops in once as the
 *  section enters (extra -5.5deg on top of its resting tilt, so it
 *  starts at -8deg, plus 24px, from transparent), 700ms ease-out.
 *  Nothing else moves. Skipped entirely under prefers-reduced-motion.
 * ------------------------------------------------------------------ */

const PHOTO = "/about/showcase-dina.webp";
const photo = dims(PHOTO);

/** In-page link that goes through the smooth scroller. */
function Anchor({
  to,
  className,
  children,
}: {
  to: "work" | "courses" | "contact";
  className?: string;
  children: ReactNode;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(to);
  };
  return (
    <a href={`#${to}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}

export function About() {
  const reduced = useReducedMotion();

  return (
    <Section
      id="about"
      surface="light"
      className="about"
      innerClassName="about__inner"
    >
      <SectionHeader
        eyebrow="About"
        title="Designer by craft, artist at heart."
        accent="heart"
        lead="I'm Dina, a graphic designer and painter from Egypt. I build brand identities, visuals and motion, and I teach drawing to kids and adults."
      />

      <div className="about__body">
        {/* ---------- the stage ---------- */}
        <div className="about__stage">
          <figure className="polaroid">
            <motion.div
              className="polaroid__card"
              initial={reduced ? false : { opacity: 0, y: 24, rotate: -5.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span aria-hidden="true" className="polaroid__tape" />
              <img
                src={PHOTO}
                alt="Dina Hamza smiling in a striped jumper and orange headscarf, holding two of her large abstract paintings"
                width={photo.w}
                height={photo.h}
                loading="lazy"
                decoding="async"
                className="polaroid__img"
              />
              <figcaption className="polaroid__caption">
                With a couple of my paintings
              </figcaption>
            </motion.div>
          </figure>

          <div className="about__panels">
            {/* LEFT — the designer */}
            <article className="about-panel about-panel--craft">
              <div className="about-panel__top">
                <span className="about-panel__label">By craft</span>
                <div className="about-panel__text">
                  <h3 className="about-panel__title">Graphic designer</h3>
                  <p className="about-panel__body">
                    I turn ideas into visual systems that feel clear,
                    distinctive and memorable, across branding, social media,
                    print and motion.
                  </p>
                </div>
                <ul className="about-panel__tags">
                  {["Brand identity", "Social media", "Print", "Motion"].map(
                    (t) => (
                      <li key={t} className="about-panel__tag">
                        {t}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="about-panel__foot">
                <p className="about-panel__note">Designing for 3+ years with</p>
                <p className="about-panel__strong">
                  Illustrator, Photoshop, After Effects, Premiere Pro
                </p>
              </div>
            </article>

            {/* RIGHT — the artist */}
            <article className="about-panel about-panel--heart">
              <div className="about-panel__top">
                <span className="about-panel__label">At heart</span>
                <div className="about-panel__text">
                  <h3 className="about-panel__title">
                    Painter and drawing teacher
                  </h3>
                  <p className="about-panel__body">
                    Oil, acrylic and pastel keep my hands busy between projects.
                    I also teach drawing to kids and adults, and that practice
                    feeds every design I make.
                  </p>
                </div>
                <ul className="about-panel__tags">
                  {["Oil", "Acrylic", "Pastel", "Portraits"].map((t) => (
                    <li key={t} className="about-panel__tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="about-panel__foot">
                <p className="about-panel__note">Classes for kids and adults</p>
                <Anchor to="courses" className="about-panel__link tap-44">
                  See the drawing courses
                </Anchor>
              </div>
            </article>
          </div>
        </div>

        {/* ---------- footer row ---------- */}
        <div className="about__foot">
          <p className="about__intro">
            I'm Dina, a graphic designer and painter from Egypt. Two sides of
            one practice: one plans every detail, the other keeps the work
            alive.
          </p>
          <div className="about__actions">
            <Anchor
              to="work"
              className="btn btn--lg bg-content-1 text-surface-1 transition-colors duration-ui ease-ui hover:bg-accent-fill hover:text-accent-contrast"
            >
              See my work
            </Anchor>
            <Anchor
              to="contact"
              className="btn btn--lg border border-palette-muted-dark text-content-1 transition-colors duration-ui ease-ui hover:border-content-1"
            >
              Get in touch
            </Anchor>
          </div>
        </div>
      </div>
    </Section>
  );
}
