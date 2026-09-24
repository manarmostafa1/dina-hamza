import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { featuredProjects } from "@/data/portfolio";

/* ------------------------------------------------------------------ *
 *  FEATURED PROJECTS — the home page selection.
 *
 *  Full-bleed dark block, joined to the sketchbook below it: this
 *  section carries the rounded TOP corners, the gallery the rounded
 *  BOTTOM ones, and they meet with no seam. The content keeps the
 *  normal container width; only the background runs edge to edge.
 *
 *  Shows the `featured` projects (see src/data/projectNames.ts); every
 *  project is on /work.
 * ------------------------------------------------------------------ */
export function Projects() {
  return (
    <Section id="work" surface="dark" className="work-panel">
      <SectionHeader
        eyebrow="Work"
        title="Featured projects."
        accent="projects"
        lead="Brand identities, campaigns, packaging and illustration."
        tone="dark"
      />

      <ProjectGrid projects={featuredProjects} />

      <div className="work-end">
        <Link to="/work" className="work-all">
          View all projects
          <ArrowRight size={16} aria-hidden="true" className="work-all__arrow" />
        </Link>
      </div>
    </Section>
  );
}
