import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

let lenisInstance: Lenis | null = null;

/* Lenis is not created under prefers-reduced-motion, so both helpers
   fall back to an instant native scroll. */
export function scrollToTop(immediate = false) {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0 });
}

/* Every section carries scroll-margin-top = navbar height + its top
   offset + 16px (index.css), which Lenis honours on its own; so the
   section lands 16px below the fixed navbar with no extra offset here.
   The native fallback (reduced motion) reads the same value. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el);
    return;
  }
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - margin });
}

/* Page scroll lock for overlays. overflow: hidden alone does not stop
   Lenis on touch/wheel, so Lenis is paused too. */
export function lockScroll() {
  lenisInstance?.stop();
  document.documentElement.style.overflow = "hidden";
}
export function unlockScroll() {
  document.documentElement.style.overflow = "";
  lenisInstance?.start();
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  /* Every route (and the first render) opens at the very top, instantly.
     Lenis keeps its own scroll position, so it is reset as well as the
     window. */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
}
