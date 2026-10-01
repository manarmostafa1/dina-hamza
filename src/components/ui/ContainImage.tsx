import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  "Contain + blurred backdrop" — an image that is never cropped, in a
 *  frame of any shape. Styling: `.cframe*` in index.css.
 *
 *    backdrop  the same file, object-fit: cover, scaled and blurred, so
 *              the frame's empty space is filled with the image's own
 *              colours (same URL = one download)
 *    veil      a light dark wash over the backdrop
 *    image     object-fit: contain — the whole artwork, always
 *
 *  Used by the project cards, the project page banner and gallery, and
 *  the previous / next thumbnails. `children` are drawn over it (the
 *  card's category tab).
 * ------------------------------------------------------------------ */
export function ContainImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className,
  imgClassName,
  children,
}: {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  loading?: "lazy" | "eager";
  className?: string;
  imgClassName?: string;
  children?: ReactNode;
}) {
  return (
    <span className={cn("cframe", className)}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading={loading}
        decoding="async"
        className="cframe__bg"
      />
      <span aria-hidden="true" className="cframe__veil" />
      <img
        src={src}
        alt={alt}
        width={width ?? undefined}
        height={height ?? undefined}
        loading={loading}
        decoding="async"
        className={cn("cframe__img", imgClassName)}
      />
      {children}
    </span>
  );
}
