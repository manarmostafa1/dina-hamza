/** @type {import('tailwindcss').Config}
 *
 *  This file DEFINES NO VALUES. Every entry points at a custom property
 *  declared in src/styles/tokens.css, so the design system has exactly
 *  one source of truth and section-scoped theming (data-surface="dark")
 *  re-themes utilities automatically.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* ---------------------------------------------------------- *
       *  Spacing — named steps so a stray `p-[22px]` stands out in
       *  review. The numeric Tailwind scale stays available but the
       *  codebase uses these.
       * ---------------------------------------------------------- */
      spacing: {
        "3xs": "var(--space-4)",
        "2xs": "var(--space-8)",
        xs: "var(--space-12)",
        sm: "var(--space-16)",
        md: "var(--space-24)",
        lg: "var(--space-32)",
        xl: "var(--space-48)",
        "2xl": "var(--space-64)",
        "3xl": "var(--space-96)",
        "4xl": "var(--space-128)",
        "5xl": "var(--space-160)",
        gutter: "var(--gutter)",
        section: "var(--section-py)",
        "section-tight": "var(--section-py-tight)",
        btn: "var(--btn-h)",
        nav: "var(--nav-h)",
        "nav-total": "var(--nav-total)",
        surface: "var(--radius-surface)",
      },

      maxWidth: {
        container: "var(--container)",
      },

      /* ---------------------------------------------------------- *
       *  Colour roles
       * ---------------------------------------------------------- */
      colors: {
        surface: {
          1: "rgb(var(--surface-1) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
          3: "rgb(var(--surface-3) / <alpha-value>)",
        },
        content: {
          1: "rgb(var(--text-1) / <alpha-value>)",
          2: "rgb(var(--text-2) / <alpha-value>)",
          3: "rgb(var(--text-3) / <alpha-value>)",
        },
        edge: {
          DEFAULT: "rgb(var(--border-1) / <alpha-value>)",
          strong: "rgb(var(--border-2) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          text: "rgb(var(--accent-text) / <alpha-value>)",
          fill: "rgb(var(--accent-fill) / <alpha-value>)",
          contrast: "rgb(var(--accent-contrast) / <alpha-value>)",
          secondary: "rgb(var(--accent-2) / <alpha-value>)",
        },
        /* Large accent words and numbers — apricot-strong / apricot. */
        emph: "rgb(var(--emph) / <alpha-value>)",

        /* Fixed palette colours that must NOT flip with a section's
           surface (tapes, lightboxes, the active filter pill). */
        palette: {
          bg: "rgb(var(--c-bg) / <alpha-value>)",
          ink: "rgb(var(--c-ink) / <alpha-value>)",
          "muted-dark": "rgb(var(--c-muted-dark) / <alpha-value>)",
          sage: "rgb(var(--c-sage) / <alpha-value>)",
          "sage-strong": "rgb(var(--c-sage-strong) / <alpha-value>)",
          apricot: "rgb(var(--c-apricot) / <alpha-value>)",
          "apricot-strong": "rgb(var(--c-apricot-strong) / <alpha-value>)",
        },

        /* Legacy aliases kept so the case-study page and loader keep
           working; they resolve to the same roles. */
        canvas: "rgb(var(--surface-1) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--text-1) / <alpha-value>)",
          soft: "rgb(var(--text-2) / <alpha-value>)",
          muted: "rgb(var(--text-3) / <alpha-value>)",
        },
        line: "rgb(var(--border-1) / <alpha-value>)",
      },

      /* ---------------------------------------------------------- *
       *  Type — six steps. `eyebrow` is --fs-small in caps, not a
       *  seventh size.
       * ---------------------------------------------------------- */
      fontSize: {
        display: [
          "var(--fs-display)",
          {
            lineHeight: "var(--lh-display)",
            letterSpacing: "var(--ls-display)",
            fontWeight: "var(--fw-heading)",
          },
        ],
        h1: [
          "var(--fs-h1)",
          {
            lineHeight: "var(--lh-h1)",
            letterSpacing: "var(--ls-h1)",
            fontWeight: "var(--fw-heading)",
          },
        ],
        h2: [
          "var(--fs-h2)",
          {
            lineHeight: "var(--lh-h2)",
            letterSpacing: "var(--ls-h2)",
            fontWeight: "var(--fw-heading)",
          },
        ],
        h3: [
          "var(--fs-h3)",
          {
            lineHeight: "var(--lh-h3)",
            letterSpacing: "var(--ls-h3)",
            fontWeight: "var(--fw-heading)",
          },
        ],
        body: [
          "var(--fs-body)",
          { lineHeight: "var(--lh-body)", letterSpacing: "var(--ls-body)" },
        ],
        /* The navbar / footer wordmark — not a heading. */
        logo: [
          "var(--fs-logo)",
          {
            lineHeight: "var(--lh-h3)",
            letterSpacing: "var(--ls-h3)",
            fontWeight: "var(--fw-heading)",
          },
        ],
        small: [
          "var(--fs-small)",
          { lineHeight: "var(--lh-small)", letterSpacing: "var(--ls-small)" },
        ],
        eyebrow: [
          "var(--fs-eyebrow)",
          {
            lineHeight: "1",
            letterSpacing: "var(--ls-eyebrow)",
            fontWeight: "var(--fw-medium)",
          },
        ],
      },

      fontFamily: {
        /* Both families are theme variables — see
           src/styles/themes.css. Each theme puts an ampersand-only
           subset first in the display stack where its display face
           needs one. */
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },

      fontWeight: {
        regular: "var(--fw-regular)",
        medium: "var(--fw-medium)",
        semibold: "var(--fw-semibold)",
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
        surface: "var(--radius-surface)",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        none: "none",
      },

      transitionTimingFunction: {
        entrance: "var(--ease-entrance)",
        ui: "var(--ease-ui)",
      },
      transitionDuration: {
        entrance: "var(--dur-entrance)",
        ui: "var(--dur-ui)",
      },
    },
  },
  plugins: [],
};
