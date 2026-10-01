import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { Lightbox } from "@/components/ui/Lightbox";
import { Footer } from "@/components/sections/Footer";
import { coursePhotos, coursesPage as copy } from "@/data/courses";

/* ------------------------------------------------------------------ *
 *  /courses — photos from the classes.
 *
 *  The /work page's frame: one full-bleed dark block (back link, page
 *  header, the photos), then a small light CTA and the footer. The
 *  photos use the project pages' gallery (PhotoGrid: equal tiles, each
 *  photo whole on its blurred backdrop) and lightbox. Data:
 *  src/data/courses.ts. Scroll-to-top on arrival is handled by
 *  SmoothScroll (route change).
 * ------------------------------------------------------------------ */
const TITLE = "Courses · Dina Hamza";
const LABEL = "Drawing & Painting Classes";

export default function CoursesPage() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  const n = coursePhotos.length;

  return (
    <main id="main">
      <section data-surface="dark" data-nav="dark" className="work-page">
        <div className="container-wide">
          <Link to="/" className="work-page__back tap-44">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <SectionHeader
            as="h1"
            eyebrow={copy.eyebrow}
            title={copy.title}
            accent={copy.accent}
            lead={
              <>
                {copy.lead}
                <span className="work-page__count">
                  {n} {n === 1 ? "photo" : "photos"}
                </span>
              </>
            }
            tone="dark"
          />

          <PhotoGrid images={coursePhotos} label={LABEL} total={n} onOpen={setActive} />
        </div>
      </section>

      <section data-surface="light" data-nav="light" className="work-cta section lift-off">
        <div className="container-wide work-cta__inner">
          <p className="work-cta__text">{copy.cta}</p>
          {/* to the home page's contact form, with the "Drawing class"
              chip selected (Contact.tsx reads ?service=) */}
          <Link
            to="/?service=drawing-class#contact"
            className="btn btn--lg bg-content-1 text-surface-1 transition-colors duration-ui ease-ui hover:bg-accent-fill hover:text-accent-contrast"
          >
            {copy.ctaButton}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />

      <Lightbox images={coursePhotos} index={active} onIndex={setActive} label={LABEL} />
    </main>
  );
}
