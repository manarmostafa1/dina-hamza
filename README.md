# Dina Hamza — Portfolio

A premium, interactive portfolio for **Dina Hamza** — Graphic Designer, Visual Artist & Art Instructor. Built to feel like a creative experience: smooth scrolling, scroll-reveal animations, a custom cursor, magnetic buttons, filterable case studies and a fullscreen illustration lightbox.

## Tech stack

- **React 18 + Vite 6** with **TypeScript**
- **Tailwind CSS 3** (custom design tokens & components)
- **Framer Motion** for all animation
- **React Router** for the home page + per-project case studies
- **Lenis** for smooth scrolling
- **Lucide** icons
- shadcn-style `Button` primitive (Radix Slot + CVA)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

## Structure

```
src/
  components/
    shell/       # Loader, Cursor, Navbar, SmoothScroll, ScrollProgress
    ui/          # GradientArt, Reveal, AnimatedText, Magnetic, Button, Marquee, SectionHeading
    sections/    # Hero, About, Services, Projects, Gallery, Courses,
                 # Skills, Experience, Testimonials, Contact, Footer
  pages/         # Home, ProjectDetail (case study)
  data/          # content.ts — all copy, projects, courses, skills, etc.
  lib/           # cn() class-merge helper
```

## Sections

Hero · About · Services · Featured Projects (filterable → case studies) · Illustration Gallery (masonry + lightbox) · Art Courses · Skills · Experience timeline · Testimonials slider · Contact · Footer.

## Notes on imagery

All visuals are rendered by **`GradientArt`** — a deterministic, seed-based
abstract artwork generator — so the site ships completely self-contained with
no external image dependencies. To use real photography/artwork, replace the
`<GradientArt>` instances with `<img>` and drop the `palette` fields from
`src/data/content.ts`.

Fonts are loaded from Fontshare (General Sans) and Google Fonts (Fraunces).
The contact form is front-end only — wire the `onSubmit` in
`src/components/sections/Contact.tsx` to your email service or backend.
