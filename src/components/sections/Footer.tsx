import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { scrollToTop } from "@/components/shell/SmoothScroll";
import { CONTACT_EMAIL, contactLinks } from "@/data/contact";
import { cn } from "@/lib/utils";
import { BehanceIcon } from "@/components/ui/BehanceIcon";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 *  FOOTER — adapted from CinematicFooter.
 *
 *  CURTAIN REVEAL: the wrapper sits in normal flow, 100svh tall, with a
 *  clip-path. The <footer> inside is position: fixed to the viewport
 *  bottom, and clip-path clips fixed descendants too — so the footer is
 *  only visible through the wrapper's own box, and scrolling the last
 *  section (which carries .lift-off: opaque, z-10, rounded bottom and a
 *  shadow) up past it looks like a sheet lifting off the footer.
 *
 *  Styling: `.cfooter*` in index.css. GSAP drives the giant-text
 *  parallax, the content rise and the magnetic pills; everything is
 *  inside gsap.context() and reverted on unmount. Reduced motion: no
 *  scrub, no magnetic movement, CSS loops stopped, content visible.
 * ------------------------------------------------------------------ */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Where the footer is a normal section instead of the curtain. Keep in
   sync with the matching @media block in index.css. Phones (< 768), and
   any screen under 640px tall: the fixed footer is exactly one screen
   tall and its content needs ~640px, so below that the bottom of it
   (pills, badge, back-to-top) could never be scrolled into view — the
   case on every phone held sideways (844×390, 932×430). */
const STATIC_FOOTER = "(max-width: 767.98px), (max-height: 639.98px)";
const staticFooter = () =>
  typeof window !== "undefined" && window.matchMedia(STATIC_FOOTER).matches;

/* ---------------- magnetic pill ---------------- */

type MagneticProps = ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: ElementType;
    children: ReactNode;
  };

const Magnetic = forwardRef<HTMLElement, MagneticProps>(
  ({ as: Component = "button", className, children, ...props }, forwarded) => {
    const local = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const el = local.current;
      /* touch or reduced motion: a normal link/button */
      if (!el || !finePointer() || prefersReduced()) return;

      const ctx = gsap.context(() => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };
        const leave = () =>
          gsap.to(el, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        return () => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        };
      }, el);
      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          local.current = node;
          if (typeof forwarded === "function") forwarded(node);
          else if (forwarded) forwarded.current = node;
        }}
        className={cn("cfooter-magnetic", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Magnetic.displayName = "Magnetic";

/* ---------------- marquee ---------------- */

const MARQUEE: { text: string; serif?: boolean }[] = [
  { text: "Let's work together" },
  { text: "Say hello", serif: true },
  { text: "Brand identity" },
  { text: "Social media", serif: true },
  { text: "Drawing classes" },
  { text: "Available for projects", serif: true },
];

function MarqueeRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="cfooter-marquee__row" aria-hidden={hidden || undefined}>
      {MARQUEE.map((m) => (
        <span key={m.text} className="cfooter-marquee__item">
          <span className={m.serif ? "cfooter-marquee__serif" : "cfooter-marquee__caps"}>
            {m.text}
          </span>
          <span aria-hidden="true" className="cfooter-marquee__star">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/* ---------------- footer ---------------- */

const behance = contactLinks.find((l) => l.icon === "behance")!;
const linkedin = contactLinks.find((l) => l.icon === "linkedin")!;
const whatsapp = contactLinks.find((l) => l.icon === "whatsapp")!;
const EXT = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const year = new Date().getFullYear();
  /* re-evaluated on rotate / resize, so turning a phone sideways and back
     switches the scrubbed reveal off and on with the CSS */
  const [isStatic, setIsStatic] = useState(staticFooter);
  useEffect(() => {
    const mq = window.matchMedia(STATIC_FOOTER);
    const on = () => setIsStatic(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const reduced = prefersReduced();
    /* A static footer (see STATIC_FOOTER) has no reveal to scrub — show
       it as it is. */
    const ctx = gsap.context(() => {
      if (reduced || isStatic) {
        gsap.set([giantRef.current, headingRef.current, linksRef.current], {
          clearProps: "all",
        });
        return;
      }
      /* giant text: parallax + scale-in */
      gsap.fromTo(
        giantRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: wrap, start: "top 80%", end: "bottom bottom", scrub: 1 },
        }
      );
      /* heading, then the links */
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: wrap, start: "top 40%", end: "bottom bottom", scrub: 1 },
        }
      );
    }, wrap);

    /* Trigger positions depend on the page height above the footer,
       which changes as images load and as the pinned gallery measures
       itself — refresh on load and whenever the page resizes. */
    let t = 0;
    const refresh = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    window.addEventListener("load", refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    refresh();

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ro.disconnect();
      ctx.revert();
    };
  }, [pathname, isStatic]);

  return (
    <div ref={wrapperRef} className="cfooter-curtain">
      <footer data-surface="light" data-nav="light" className="cfooter">
        <div aria-hidden="true" className="cfooter-aurora" />

        <div ref={giantRef} aria-hidden="true" className="cfooter-giant">
          Dina Hamza
        </div>

        {/* tilted sage tape */}
        <div className="cfooter-marquee">
          <ul className="sr-only">
            {MARQUEE.map((m) => (
              <li key={m.text}>{m.text}</li>
            ))}
          </ul>
          <div aria-hidden="true" className="cfooter-marquee__track">
            <MarqueeRow hidden />
            <MarqueeRow hidden />
          </div>
        </div>

        {/* centre */}
        <div className="cfooter-main">
          <h2 ref={headingRef} className="cfooter-heading">
            Let's make something <em>memorable.</em>
          </h2>

          <div ref={linksRef} className="cfooter-links">
            <div className="cfooter-links__row">
              <Magnetic
                as="a"
                href={`mailto:${CONTACT_EMAIL}`}
                className="cfooter-pill cfooter-pill--lg"
              >
                <Mail size={20} aria-hidden="true" />
                {CONTACT_EMAIL}
              </Magnetic>
              <Magnetic
                as="a"
                href={whatsapp.href}
                {...EXT}
                className="cfooter-pill cfooter-pill--lg"
              >
                <MessageCircle size={20} aria-hidden="true" />
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </Magnetic>
            </div>
            <div className="cfooter-links__row">
              {[behance, linkedin].map((l) => (
                <Magnetic
                  key={l.value}
                  as="a"
                  href={l.href}
                  {...EXT}
                  className="cfooter-pill cfooter-pill--sm"
                >
                  {l.icon === "behance" && <BehanceIcon size={16} />}
                  {l.value} ↗<span className="sr-only"> (opens in a new tab)</span>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="cfooter-bar">
          <p className="cfooter-copy">© {year} Dina Hamza</p>
          <p className="cfooter-pill cfooter-badge">
            Crafted with{" "}
            <span aria-hidden="true" className="cfooter-heart">
              ♥
            </span>
            <span className="sr-only">love</span> in New Cairo
          </p>
          <Magnetic
            as="button"
            type="button"
            onClick={() => scrollToTop()}
            aria-label="Back to top"
            className="cfooter-pill cfooter-top"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </Magnetic>
        </div>
      </footer>
    </div>
  );
}
