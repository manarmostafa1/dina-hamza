import { useRef, useState, type ComponentType, type FormEvent } from "react";
import { useInView } from "framer-motion";
import {
  ArrowUpRight,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { BehanceIcon } from "@/components/ui/BehanceIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReducedMotion } from "@/lib/motion";
import { sendPostcard } from "@/lib/sendPostcard";
import {
  CONTACT_EMAIL,
  DEFAULT_SERVICES,
  LOCATION,
  SERVICES,
  contactLinks,
  type ContactIcon,
} from "@/data/contact";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  CONTACT — a postcard.
 *
 *      [ pitch + contact rows ]   [ tilted postcard on an apricot card ]
 *
 *  Layout: `.contact*` / `.postcard*` in index.css. Delivery goes
 *  through sendPostcard() (src/lib/sendPostcard.ts) to Web3Forms, which
 *  emails it; the key is VITE_WEB3FORMS_KEY (see .env.example).
 *
 *  Entrance (once, in view): both cards rise 24px and fade in, and the
 *  postcard settles into its tilt, 700ms. Skipped under reduced motion.
 * ------------------------------------------------------------------ */

/* "Veiled Eyes" — the painting used on the postcard stamp (the same
   file the sketchbook gallery shows). */
const VEILED_EYES_IMAGE = "/art-blue-eyes.jpg";

const ICONS: Record<ContactIcon, ComponentType<{ size?: number | string }>> = {
  mail: Mail,
  whatsapp: MessageCircle,
  behance: BehanceIcon,
  linkedin: Linkedin,
};

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.25 });
  const botRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [services, setServices] = useState<string[]>(DEFAULT_SERVICES);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const toggle = (s: string) =>
    setServices((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    );

  const validate = (): Errors => {
    const e: Errors = {};
    if (!message.trim()) e.message = "Please write a short message.";
    if (!name.trim()) e.name = "Please add your name.";
    if (!email.trim()) e.email = "Please enter a valid email.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Please enter a valid email.";
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (status === "sending") return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = (["message", "name", "email"] as const).find((k) => e[k]);
      document.getElementById(`pc-${first}`)?.focus();
      return;
    }
    /* honeypot ticked: a bot. Show the normal success and send nothing,
       so it gets no signal that it was caught. */
    const bot = !!botRef.current?.checked;
    setStatus("sending");
    try {
      if (!bot) {
        await sendPostcard({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          services: services.length ? services.join(", ") : "Not specified",
          botcheck: bot,
        });
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setServices(DEFAULT_SERVICES);
    } catch {
      setStatus("error");
    }
  };

  /* editing again after a result returns the button to its idle label */
  const touch = () => {
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`pc-${k}-error`} className="postcard__error">
        {errors[k]}
      </p>
    ) : null;

  return (
    <Section id="contact" surface="dark" lift className="contact lift-off">
      <div className="contact__grid">
        {/* ---------------- left: the pitch ---------------- */}
        <div className="contact__pitch">
          <SectionHeader
            eyebrow="Contact"
            title="Let's create something amazing together."
            accent="amazing"
            lead="Have a brand to build, a campaign to launch, or want to join a drawing class? Send me a postcard, or reach me directly."
            variant="stacked"
            tone="dark"
          />

          <ul className="contact-list">
            {contactLinks.map((l) => {
              const Icon = ICONS[l.icon];
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="contact-row"
                  >
                    <span aria-hidden="true" className="contact-row__icon">
                      <Icon size={18} />
                    </span>
                    <span className="contact-row__text">
                      <span className="contact-row__label">{l.label}</span>
                      <span className="contact-row__value">{l.value}</span>
                    </span>
                    <ArrowUpRight size={20} aria-hidden="true" className="contact-row__arrow" />
                    {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="contact__location">
            <MapPin size={16} aria-hidden="true" />
            {LOCATION}
          </p>
        </div>

        {/* ---------------- right: the postcard ---------------- */}
        <div
          ref={stageRef}
          className={cn("postcard-stage", (inView || reduced) && "is-in", reduced && "is-still")}
        >
          <div aria-hidden="true" className="postcard-back" />
          <form noValidate onSubmit={onSubmit} className="postcard" aria-label="Send Dina a postcard">
            {/* message side */}
            <div className="postcard__message">
              <p className="postcard__hi" aria-hidden="true">
                Hi Dina,
              </p>
              <label htmlFor="pc-message" className="sr-only">
                Message
              </label>
              <textarea
                id="pc-message"
                name="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  touch();
                }}
                placeholder="Tell me about your project..."
                required
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "pc-message-error" : undefined}
                className="postcard__textarea"
              />
              {err("message")}

              <fieldset className="postcard__services">
                <legend className="postcard__services-label">I need help with</legend>
                <div className="postcard__chips">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={services.includes(s)}
                      onClick={() => {
                        toggle(s);
                        touch();
                      }}
                      className="postcard__chip"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              <input type="hidden" name="services" value={services.join(", ")} />
              {/* honeypot — invisible to people, filled in by form bots */}
              <input
                ref={botRef}
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="postcard__honeypot"
              />
            </div>

            <span aria-hidden="true" className="postcard__divider" />

            {/* address side */}
            <div className="postcard__address">
              {/* stamp + postmark — the supplied code, values unchanged.
                  The area's own box (150px tall) is in index.css, so phones
                  can lift it into the card's top-right corner. */}
              <div className="stamp-area">
                {/* stamp */}
                <div
                  style={{
                    position: "absolute", right: 0, top: 0, width: 112, height: 136,
                    boxSizing: "border-box", padding: 7, background: "#FFFFFF",
                    border: "3px dotted #F6F1E6", outline: "1px solid #E6DFCE",
                    transform: "rotate(3deg)",
                  }}
                >
                  <img
                    src={VEILED_EYES_IMAGE}
                    alt="Stamp showing Dina's painting Veiled Eyes"
                    loading="lazy"
                    decoding="async"
                    style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* postmark */}
                <svg
                  width="170" height="110" viewBox="0 0 170 110" aria-hidden="true"
                  style={{ position: "absolute", right: 56, top: 44, overflow: "visible", pointerEvents: "none" }}
                >
                  <circle cx="52" cy="52" r="42" fill="none" stroke="#56694F" strokeWidth="2" opacity="0.8" />
                  <circle cx="52" cy="52" r="33" fill="none" stroke="#56694F" strokeWidth="1" opacity="0.8" />
                  <defs>
                    <path id="pm" d="M52,52 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                  </defs>
                  <text style={{ fontFamily: "inherit", fontSize: "8.5px", fontWeight: 700, letterSpacing: "2px", fill: "#56694F", opacity: 0.85 }}>
                    <textPath href="#pm">NEW CAIRO ✦ EGYPT ✦ 2026 ✦</textPath>
                  </text>
                  <text x="52" y="57" textAnchor="middle" style={{ fontFamily: "inherit", fontSize: "13px", fontWeight: 700, fill: "#56694F", opacity: 0.85 }}>
                    DH
                  </text>
                  <path
                    d="M92 34 q10 -8 20 0 t20 0 t20 0 t20 0 M92 50 q10 -8 20 0 t20 0 t20 0 t20 0 M92 66 q10 -8 20 0 t20 0 t20 0 t20 0"
                    fill="none" stroke="#56694F" strokeWidth="1.6" opacity="0.7"
                  />
                </svg>
              </div>

              <div className="postcard__fields">
                <div className="postcard__field">
                  <label htmlFor="pc-name" className="postcard__label">
                    From
                  </label>
                  <input
                    id="pc-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      touch();
                    }}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "pc-name-error" : undefined}
                    className="postcard__input"
                  />
                  {err("name")}
                </div>
                <div className="postcard__field">
                  <label htmlFor="pc-email" className="postcard__label">
                    Your email
                  </label>
                  <input
                    id="pc-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      touch();
                    }}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "pc-email-error" : undefined}
                    className="postcard__input"
                  />
                  {err("email")}
                </div>

                <div className="postcard__submit">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="postcard__send"
                  >
                    {status === "sending"
                      ? "Sending..."
                      : status === "sent"
                        ? "Postcard sent ✓"
                        : "Send postcard"}
                    {status !== "sent" && status !== "sending" && (
                      <Send size={18} aria-hidden="true" className="postcard__plane" />
                    )}
                  </button>
                  <p aria-live="polite" className="postcard__status">
                    {status === "sent" && "Thanks! I'll reply within a couple of days."}
                    {status === "error" && (
                      <span className="postcard__status--error">
                        Something went wrong. Email me at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
