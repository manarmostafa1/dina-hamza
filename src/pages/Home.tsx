import { Hero } from "@/components/sections/Hero";
import { MarqueeBand } from "@/components/ui/Marquee";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Gallery } from "@/components/sections/Gallery";
import { Courses } from "@/components/sections/Courses";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/* ------------------------------------------------------------------ *
 *  Same sections, same order. The only structural change is that the
 *  marquee ticker, which used to be absolutely positioned inside the
 *  hero, now sits between the hero and About as its own band — same
 *  content, same position on the page, but with a boundary of its own.
 *
 *  Surface run (see Section.tsx for the rule):
 *    light ── Hero · Marquee · About · Services
 *    dark  ── Projects · Gallery
 *    light ── Courses · Experience
 *    dark  ── Contact · Footer
 * ------------------------------------------------------------------ */
export default function Home() {
  return (
    <main id="main">
      {/* One viewport: the hero fills what the band leaves, so the band
          sits on the bottom edge of the first screen. See .hero-fold. */}
      <div className="hero-fold">
        <Hero />
        <MarqueeBand
          items={[
            "Brand Identity",
            "Logo Design",
            "Illustration",
            "Painting",
            "Teaching",
            "Packaging",
          ]}
        />
      </div>
      <About />
      <Services />
      <Projects />
      <Gallery />
      <Courses />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
