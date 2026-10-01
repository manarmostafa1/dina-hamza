import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ContainImage } from "@/components/ui/ContainImage";

/* ------------------------------------------------------------------ *
 *  A gallery of equal 4:3 tiles, 3 / 2 / 1 columns, each image whole on
 *  its blurred backdrop (ContainImage) — the project pages and
 *  /courses. Styling: `.case-grid`, `.case-shot` in index.css.
 *
 *  A tile opens the lightbox at `offset + i` (the project page's
 *  lightbox may start with a banner that isn't in the grid).
 * ------------------------------------------------------------------ */
export function PhotoGrid({
  images,
  label,
  total,
  offset = 0,
  onOpen,
}: {
  images: { src: string; width?: number | null; height?: number | null; alt?: string }[];
  /** names the images: "{label} — image 3" */
  label: string;
  /** images in the lightbox (for "image 3 of N") */
  total: number;
  offset?: number;
  onOpen: (lightboxIndex: number) => void;
}) {
  return (
    <RevealGroup as="ul" className="case-grid">
      {images.map((img, i) => {
        const n = i + offset + 1;
        return (
          <RevealItem as="li" key={img.src} className="case-grid__item">
            <button
              type="button"
              onClick={() => onOpen(i + offset)}
              aria-label={`Open ${label}, image ${n} of ${total}`}
              className="case-shot"
            >
              <ContainImage
                src={img.src}
                alt={img.alt ?? `${label} — image ${n}`}
                width={img.width}
                height={img.height}
                className="case-shot__frame"
              />
            </button>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
