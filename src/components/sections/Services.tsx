import type { ReactNode } from "react";
import {
  Clapperboard,
  LayoutGrid,
  Newspaper,
  PenTool,
  Presentation,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { services, type Service } from "@/data/content";
import { dims } from "@/data/imageMeta";

/* ------------------------------------------------------------------ *
 *  WHAT I DO — a three-column bento. Layout and breakpoints live in
 *  the `.bento*` rules in index.css; this file is content only.
 *
 *    left    Social · Print · Presentation     three even cards
 *    centre  Brand Identity                    full-height photo hero
 *    right   Video & Motion · Illustration     two cards, tags on floor
 *
 *  The icons carry each card's identity — there are no numbers and no
 *  colour dots, which encoded nothing.
 *
 *  Contrast, measured (WCAG 2.x):
 *    --text-2 body   on white 9.35 · sand 7.64 · clay 7.64 · stone 7.38
 *    --text-1 title  on every ground ≥ 14.7
 *    icon (--accent-text) on chip 6.14 · on white 7.76
 *    hero copy is measured against the rendered image + scrim; see the
 *    note on the hero card below.
 *  --text-3 is NOT used here: it is 4.29-4.44 on the three tints.
 * ------------------------------------------------------------------ */

const byTitle = (t: string) => services.find((s) => s.title === t)!;

const hero = byTitle("Brand identity and logo design");

/* Literal class names, not a template string: Tailwind purges
   @layer components rules it cannot find verbatim in the source. */
const TONE = {
  line: "bento-card--line",
  sand: "bento-card--sand",
  stone: "bento-card--stone",
  clay: "bento-card--clay",
} as const;
const TAG = {
  glass: "bento-tag--glass",
  solid: "bento-tag--solid",
  outline: "bento-tag--outline",
} as const;
type Tone = keyof typeof TONE;
interface CardSpec {
  service: Service;
  icon: ReactNode;
  tone: Tone;
  tagStyle?: "solid" | "outline";
}

const left: CardSpec[] = [
  { service: byTitle("Social media design"), icon: <LayoutGrid />, tone: "line" },
  { service: byTitle("Print design"), icon: <Newspaper />, tone: "sand" },
  { service: byTitle("Presentation design"), icon: <Presentation />, tone: "stone" },
];

const right: CardSpec[] = [
  { service: byTitle("Video and motion"), icon: <Clapperboard />, tone: "clay", tagStyle: "solid" },
  { service: byTitle("Illustration and digital art"), icon: <PenTool />, tone: "line", tagStyle: "outline" },
];

const HERO_TALL = "/services/identity-tall.webp";
const HERO_WIDE = "/services/identity-wide.webp";
const heroDims = dims(HERO_TALL);

export function Services() {
  return (
    <Section id="services" surface="light">
      <SectionHeader
        eyebrow="Services"
        title="Identity, content and motion, built as one system."
        accent="one system"
        lead="Most of this work starts with a mark and ends somewhere unexpected — a feed, a brochure, a fifteen-second cut. It holds together because it was designed to."
      />

      <RevealGroup className="bento">
        {/* ---------- centre · the anchor ----------
            First in the DOM so it leads on one column and spans the top
            on two. Copy colours measured against the rendered card at
            1920/1440/1024/768/390, brightest pixel under each run of glyphs:
            eyebrow ≥ 7.07:1, title ≥ 9.30, body ≥ 8.77, tags ≥ 12.79. */}
        <RevealItem className="bento-hero">
          <picture>
            <source
              media="(min-width: 768px) and (max-width: 1023.98px)"
              srcSet={HERO_WIDE}
            />
            <img
              src={HERO_TALL}
              alt="The gold “10 Years of Beauty & Beyond” anniversary mark for Everlast Wellness, mounted as signage across a building façade"
              width={heroDims.w}
              height={heroDims.h}
              loading="lazy"
              decoding="async"
              className="bento-hero-img"
            />
          </picture>
          {/* on-dark: the dark text roles, so .h3 is cream and .body is
              muted-on-dark here without any per-element colour. */}
          <div className="bento-hero-body on-dark">
            <div className="card-text">
              <span className="bento-hero-eyebrow text-eyebrow uppercase">
                Core service
              </span>
              <h3 className="h3">{hero.title}</h3>
              <p className="body">{hero.description}</p>
            </div>
            <Tags tags={hero.tags!} style="glass" />
          </div>
        </RevealItem>

        <div className="bento-col bento-col--left">
          {left.map((c) => (
            <RevealItem key={c.service.title} className="bento-cell">
              <Card spec={c} />
            </RevealItem>
          ))}
        </div>

        <div className="bento-col bento-col--right">
          {right.map((c) => (
            <RevealItem key={c.service.title} className="bento-cell">
              <Card spec={c} />
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </Section>
  );
}

/* icon → 28 → [title + text, 10 apart] → auto → tags on the floor.
   All of it is the card's flex gap; nothing on the text sets a margin. */
function Card({ spec }: { spec: CardSpec }) {
  const { service, icon, tone, tagStyle } = spec;
  return (
    <article className={cn("bento-card", TONE[tone])}>
      <span aria-hidden="true" className="bento-chip">
        {icon}
      </span>
      <div className="card-text">
        <h3 className="h3">{service.title}</h3>
        <p className="body">{service.description}</p>
      </div>
      {service.tags && tagStyle && (
        <Tags tags={service.tags} style={tagStyle} className="bento-card__tags" />
      )}
    </article>
  );
}

function Tags({
  tags,
  style,
  className,
}: {
  tags: string[];
  style: keyof typeof TAG;
  className?: string;
}) {
  return (
    <ul className={cn("bento-tags", className)}>
      {tags.map((t) => (
        <li key={t} className={cn("bento-tag", TAG[style])}>
          {t}
        </li>
      ))}
    </ul>
  );
}
