import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, getAdjacent, projects, redirectFor } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContainImage } from "@/components/ui/ContainImage";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { Lightbox } from "@/components/ui/Lightbox";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Project page — THE template for every project. One dynamic route
 *  (/work/:slug in App.tsx) renders this for all of them; everything
 *  that differs per project (title, year, description, banner, gallery,
 *  image count, previous/next) comes from the data
 *  (src/data/portfolio.ts + src/data/projectNames.ts). Styling: `.case*`
 *  in index.css; the column is the site container (.container-wide),
 *  the same box the navbar pill sits in, so every edge lines up.
 *
 *  Nothing is cropped: the banner keeps its own aspect ratio up to 80vh
 *  (then it is contained on a blurred copy of itself), and the gallery
 *  is a grid of equal tiles, each image contained the same way
 *  (PhotoGrid / ContainImage). The banner and every gallery image open
 *  one lightbox, which walks through all of the project's images. The
 *  project's category is data only — it is not shown.
 * ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");

/* "**text**" in the copy → <strong>text</strong>, asterisks dropped.
   Split on the markers: the odd pieces are the bold ones. Plain text
   nodes only, so nothing in the copy is ever parsed as HTML. */
function withBold(text: string) {
  return text
    .split(/\*\*(.+?)\*\*/)
    .map((piece, i) => (i % 2 ? <strong key={i}>{piece}</strong> : piece));
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  const adjacent = slug ? getAdjacent(slug) : null;

  /* lightbox index into `images`: 0 = the banner */
  const [active, setActive] = useState<number | null>(null);
  /* one lightbox over every image: the banner, then the gallery. When
     the gallery already starts with the banner (bannerInGallery), the
     lightbox is just the gallery, so no image is walked through twice;
     `offset` maps a gallery tile to its lightbox index either way. */
  const gallery = project ? project.gallery : [];
  const bannerInGallery = !!project && gallery[0]?.src === project.banner.src;
  const images = !project ? [] : bannerInGallery ? gallery : [project.banner, ...gallery];
  const offset = images.length - gallery.length;

  /* a new project closes any open lightbox */
  useEffect(() => setActive(null), [slug]);

  /* browser tab: "{title} · Dina Hamza", restored on the way out */
  useEffect(() => {
    if (!project) return;
    const prev = document.title;
    document.title = `${project.title} · Dina Hamza`;
    return () => {
      document.title = prev;
    };
  }, [project]);

  /* an old URL of a project that was merged into another one */
  const moved = slug ? redirectFor(slug) : undefined;
  if (moved) return <Navigate to={`/work/${moved}`} replace />;
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
              {/* year (when there is one) and position: "2026 · 01 / 14" */}
              <Eyebrow>
                {[project.year, `${pad(index + 1)} / ${pad(projects.length)}`]
                  .filter(Boolean)
                  .join(" · ")}
              </Eyebrow>
            </Reveal>
            <Reveal index={1}>
              <h1 className="case-title">{project.title}</h1>
            </Reveal>
            {project.description.length > 0 && (
              <Reveal index={2}>
                <div className="case-desc">
                  {project.description.map((para, i) => (
                    <p key={i}>{withBold(para)}</p>
                  ))}
                </div>
              </Reveal>
            )}
          </header>

          {/* banner — eager, the page's largest image. Its own shape up to
              80vh; past that it is contained on its blurred backdrop. */}
          <Reveal>
            <button
              type="button"
              onClick={() => setActive(0)}
              aria-label={`Open ${project.title}, image 1 of ${images.length}`}
              className="case-banner"
            >
              <ContainImage
                src={cover.src}
                alt={`${project.title} — cover`}
                width={cover.width}
                height={cover.height}
                loading="eager"
                className="case-banner__frame"
                imgClassName="case-banner__img"
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
              <PhotoGrid
                images={gallery}
                label={project.title}
                total={images.length}
                offset={offset}
                onOpen={setActive}
              />
            </section>
          )}

          <nav aria-label="More projects" className="case-nav">
            <NavCard dir="prev" project={prev} />
            <NavCard dir="next" project={next} />
          </nav>
        </article>
      </div>

      <Footer />

      <Lightbox images={images} index={active} onIndex={setActive} label={project.title} />
    </main>
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
      {/* decorative (the title names the link): the card image, whole */}
      <ContainImage
        src={project.card.src}
        alt=""
        width={project.card.width}
        height={project.card.height}
        className="case-navcard__thumb"
      />
      <span className="case-navcard__text">
        <span className="case-navcard__label">{isNext ? "Next" : "Previous"}</span>
        <span className="case-navcard__title">{project.title}</span>
      </span>
      {isNext && (
        <ArrowRight size={18} aria-hidden="true" className="case-navcard__arrow" />
      )}
    </Link>
  );
}
