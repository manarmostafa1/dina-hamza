import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Eyebrow — the small dash + uppercase label.
 *
 *  There is exactly one of these. The rule (1px × 32px accent dash,
 *  --fs-small, 0.24em tracking, --text-3) lives in the `.eyebrow`
 *  class in index.css so it cannot drift per section; this component
 *  exists so no section hand-rolls the markup again.
 * ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}
