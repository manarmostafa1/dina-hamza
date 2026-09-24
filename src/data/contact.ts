/* ------------------------------------------------------------------ *
 *  Contact details — the ONE place they live. Used by the Contact
 *  section and the footer.
 * ------------------------------------------------------------------ */
export const CONTACT_EMAIL = "dinnahamza@gmail.com";

export const LOCATION = "Based in New Cairo, Egypt · working remote and on-site";

export type ContactIcon = "mail" | "whatsapp" | "behance" | "linkedin";

export interface ContactLink {
  label: string; // small line
  value: string; // big line
  href: string;
  icon: ContactIcon;
  external: boolean;
}

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    icon: "mail",
    external: false,
  },
  {
    label: "WhatsApp",
    value: "+20 109 583 8843",
    href: "https://wa.me/201095838843",
    icon: "whatsapp",
    external: true,
  },
  {
    label: "Portfolio",
    value: "Behance",
    href: "https://www.behance.net/dinnahamzaace5",
    icon: "behance",
    external: true,
  },
  {
    label: "Professional",
    value: "LinkedIn",
    href: "https://www.linkedin.com/in/dina-hamza-6bbb502a3/",
    icon: "linkedin",
    external: true,
  },
];

/** "I need help with" chips on the postcard. */
export const SERVICES = [
  "Brand identity",
  "Social media",
  "Video editing",
  "Print",
  "Presentation",
  "Drawing class",
];
export const DEFAULT_SERVICES = ["Brand identity"];
