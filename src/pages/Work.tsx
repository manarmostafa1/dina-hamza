import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { Footer } from "@/components/sections/Footer";
import { projects } from "@/data/portfolio";

/* ------------------------------------------------------------------ *
 *  /work — every project.
 *
 *  One full-bleed dark block (rounded at the bottom) holding the back
 *  link, the page header and a uniform 3 / 2 / 1-column grid of the
 *  SAME card as the home page. Then a small light CTA and the footer.
 *  Scroll-to-top on arrival is handled by SmoothScroll (route change).
 * ------------------------------------------------------------------ */
const TITLE = "All projects · Dina Hamza";

export default function Work() {
  useEffect(() => {
    const prev = document.title;
    document.title = TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  const n = projects.length;

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
            eyebrow="Selected work"
            title="All projects."
            accent="projects"
            lead={
              <>
                Brand identities, campaigns, packaging and illustration.
                <span className="work-page__count">
                  {n} {n === 1 ? "project" : "projects"}
                </span>
              </>
            }
            tone="dark"
          />

          <ProjectGrid projects={projects} layout="uniform" />
        </div>
      </section>

      <section data-surface="light" data-nav="light" className="work-cta section lift-off">
        <div className="container-wide work-cta__inner">
          <p className="work-cta__text">Have a project in mind?</p>
          <Link
            to="/#contact"
            className="btn btn--lg bg-content-1 text-surface-1 transition-colors duration-ui ease-ui hover:bg-accent-fill hover:text-accent-contrast"
          >
            Get in touch
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
