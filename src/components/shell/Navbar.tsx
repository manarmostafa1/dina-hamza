import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { lockScroll, scrollToId, scrollToTop, unlockScroll } from "./SmoothScroll";
import { EASE_ENTRANCE, EASE_UI, DUR_UI, useReducedMotion } from "@/lib/motion";

const links = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Gallery", id: "gallery" },
  { label: "Courses", id: "courses" },
  { label: "Contact", id: "contact" },
];

/* ------------------------------------------------------------------ *
 *  Which surface is behind the pill right now?
 *
 *  A 1px sampling band is placed just below the navbar and every
 *  [data-nav] section is observed against it. Whichever section covers
 *  that band wins, and the nav copies its surface — so the pill is
 *  dark-on-light over the light sections and light-on-dark over the
 *  work sections, and the text is never the 1.9:1 mush it was when it
 *  floated over bright artwork.
 * ------------------------------------------------------------------ */
function useSurfaceUnderNav() {
  const [surface, setSurface] = useState<"light" | "dark">("light");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav]")
    );
    if (!sections.length) return;

    let observer: IntersectionObserver | null = null;

    const build = () => {
      observer?.disconnect();

      const navPx =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-h"
          )
        ) * 16 || 72;
      // Sample a hair below the bottom edge of the pill.
      const y = navPx + 32;
      const bottom = Math.max(0, window.innerHeight - y - 1);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const next = entry.target.getAttribute("data-nav");
              if (next === "light" || next === "dark") setSurface(next);
            }
          }
        },
        { rootMargin: `-${y}px 0px -${bottom}px 0px`, threshold: 0 }
      );

      sections.forEach((s) => observer!.observe(s));
    };

    build();
    window.addEventListener("resize", build);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", build);
    };
  }, []);

  return surface;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const surface = useSurfaceUnderNav();
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Mobile menu: lock the page (Lenis included), focus the first link,
     trap Tab inside [menu links + the close button], close on Escape,
     and hand focus back to the toggle when it closes. */
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const toggle = toggleRef.current;
    const focusables = () => [
      ...(toggle ? [toggle] : []),
      ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []),
    ];
    const t = window.setTimeout(() => focusables()[1]?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const i = list.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : i === list.length - 1 ? 0 : i + 1;
      e.preventDefault();
      list[next].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      toggle?.focus();
    };
  }, [open]);

  /* a route change closes it too */
  useEffect(() => setOpen(false), [pathname]);

  /* Which link is active. /work and every project page → Work. On the
     home page, the section crossing the middle band of the viewport. */
  const [inView, setInView] = useState<string | null>(null);
  useEffect(() => {
    if (pathname !== "/") {
      setInView(null);
      return;
    }
    const els = links
      .map((l) => document.getElementById(l.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);
  const active = pathname.startsWith("/work") ? "work" : inView;

  const go = (id: string) => {
    const wasOpen = open;
    setOpen(false);
    /* Work is its own page; the rest are sections of the home page. */
    if (id === "work") {
      navigate("/work");
      return;
    }
    if (pathname !== "/") {
      navigate(`/#${id}`);
    } else if (wasOpen) {
      /* the menu paused the page scroll; wait for its close effect to
         release it, or the scroll is swallowed */
      setTimeout(() => scrollToId(id), 60);
    } else {
      scrollToId(id);
    }
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md bg-content-1 px-sm py-xs text-small text-surface-1 focus:not-sr-only focus:fixed focus:left-gutter focus:top-xs focus:z-[9999]"
      >
        Skip to content
      </a>

      <motion.header
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_ENTRANCE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-[9990] flex justify-center px-gutter pt-xs md:pt-sm"
      >
        <nav
          /* Flipping this attribute re-themes every token below it, so
             the pill inherits a real, AA-safe palette rather than
             hand-toggled white/black classes. */
          data-surface={surface}
          aria-label="Primary"
          className="glass flex h-nav w-full max-w-container items-center justify-between rounded-pill px-sm shadow-md transition-colors duration-ui ease-ui md:px-md"
        >
          <Link
            to="/"
            onClick={() => (pathname === "/" ? scrollToTop() : undefined)}
            className="tap-44 flex items-center gap-2xs font-display text-logo text-content-1"
          >
            <span className="grid h-8 w-8 place-items-center rounded-pill bg-content-1 text-small font-semibold text-surface-1">
              D
            </span>
            <span className="nav-wordmark">Dina Hamza</span>
          </Link>

          <div className="hidden items-center gap-3xs md:flex">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                aria-current={active === l.id ? (l.id === "work" ? "page" : "location") : undefined}
                className="nav-link tap-44 rounded-pill px-xs text-small font-medium text-content-2 transition-colors duration-ui ease-ui hover:bg-content-1/5 hover:text-content-1"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2xs">
            <button
              onClick={() => go("contact")}
              className="btn hidden bg-content-1 text-surface-1 transition-opacity duration-ui ease-ui hover:opacity-85 md:inline-flex"
            >
              Let's talk
            </button>
            <button
              ref={toggleRef}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="btn-icon border border-edge text-content-1 md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : DUR_UI, ease: EASE_UI }}
            className="mobile-menu md:hidden"
          >
            <nav aria-label="Mobile" className="mobile-menu__nav">
              <ul className="mobile-menu__list">
                {links.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => go(l.id)}
                      aria-current={active === l.id ? (l.id === "work" ? "page" : "location") : undefined}
                      className="mobile-menu__link"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => go("contact")}
                className="btn btn--lg mobile-menu__cta bg-content-1 text-surface-1"
              >
                Let's talk
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
