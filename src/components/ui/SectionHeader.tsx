import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { RevealGroup, RevealItem } from "./Reveal";

/* ------------------------------------------------------------------ *
 *  SectionHeader — the ONE header every section uses.
 *
 *    eyebrow   the small label (Eyebrow: 12px caps with the 32px rule)
 *    title     plain text. A missing final period is added.
 *    accent    the single word/phrase inside `title` set in the serif
 *              italic (must appear in `title`, first match is used)
 *    lead      optional paragraph
 *    variant   "split"   title block left, lead right (5/12), bottom-aligned
 *              "stacked" lead under the title — for a header that sits in
 *                        a column beside other content (Contact)
 *    tone      "light" | "dark" — stamped as data-surface, so every
 *              colour below comes from that surface's tokens
 *    as        "h2" (default) or "h1" for a page title (/work)
 *
 *  Styling: `.shead*` in index.css. The header carries the space below
 *  it (64px, 48px on phones); a stacked header leaves that to its column.
 * ------------------------------------------------------------------ */
/* Literal class names: Tailwind purges @layer components rules whose
   full name never appears in the source, so a template string like
   `shead--${variant}` would silently ship no CSS. */
const VARIANT = {
  split: "shead--split",
  stacked: "shead--stacked",
} as const;

export interface SectionHeaderProps {
  eyebrow: ReactNode;
  title: string;
  accent: string;
  lead?: ReactNode;
  variant?: "split" | "stacked";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  lead,
  variant = "split",
  tone = "light",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  const text = /[.!?]$/.test(title.trim()) ? title.trim() : `${title.trim()}.`;

  return (
    <RevealGroup
      className={cn("shead", VARIANT[variant], className)}
    >
      {/* data-surface on the children, not the RevealGroup's own node,
          so the tokens re-theme without touching motion props */}
      <div data-surface={tone} className="shead__title-block">
        <RevealItem>
          <Eyebrow>{eyebrow}</Eyebrow>
        </RevealItem>
        <RevealItem>
          <Heading className="shead__title">{withAccent(text, accent)}</Heading>
        </RevealItem>
      </div>
      {lead && (
        <RevealItem>
          <p data-surface={tone} className="shead__lead">
            {lead}
          </p>
        </RevealItem>
      )}
    </RevealGroup>
  );
}

/** Wraps the first occurrence of `accent` in <em>. */
function withAccent(title: string, accent: string) {
  const i = title.indexOf(accent);
  if (!accent || i < 0) {
    if (import.meta.env.DEV)
      console.warn(`SectionHeader: accent "${accent}" not found in "${title}"`);
    return title;
  }
  return (
    <Fragment>
      {title.slice(0, i)}
      <em>{accent}</em>
      {title.slice(i + accent.length)}
    </Fragment>
  );
}
