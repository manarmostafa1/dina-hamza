/* ------------------------------------------------------------------ *
 *  The contact form's submit handler — Web3Forms.
 *
 *  POSTs the postcard to https://api.web3forms.com/submit, which emails
 *  it to the address the access key was created for. No backend.
 *
 *  The key comes from VITE_WEB3FORMS_KEY (.env locally, the hosting
 *  dashboard in production — see .env.example). It is sent from the
 *  browser by design: a Web3Forms access key is public and can only
 *  send to its own inbox.
 *
 *  Resolves on success; throws on a missing key, a network error or a
 *  response without `success: true`, so the form shows its error state.
 * ------------------------------------------------------------------ */
export interface Postcard {
  name: string;
  email: string;
  message: string;
  /** Selected chips, already joined with ", ". */
  services: string;
  /** Honeypot value; a real person never ticks it. */
  botcheck: boolean;
}

const ENDPOINT = "https://api.web3forms.com/submit";
const PLACEHOLDER = "YOUR_ACCESS_KEY";

export async function sendPostcard(data: Postcard): Promise<void> {
  const key = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim();
  if (!key || key === PLACEHOLDER) {
    if (import.meta.env.DEV) {
      console.warn(
        "[contact] VITE_WEB3FORMS_KEY is not set. Add your Web3Forms access key to .env " +
          "(VITE_WEB3FORMS_KEY=...) and restart `npm run dev`. The postcard was NOT sent."
      );
    }
    throw new Error("Missing VITE_WEB3FORMS_KEY");
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `New postcard from ${data.name}`,
      from_name: "Dina Hamza website",
      name: data.name,
      /* Web3Forms sets this as Reply-To, so replying in Gmail goes
         straight to the sender. */
      email: data.email,
      services: data.services || "Not specified",
      message: data.message,
      botcheck: data.botcheck,
    }),
  });

  let json: { success?: boolean; message?: string } = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON body: treated as a failure below */
  }
  if (!res.ok || json.success !== true) {
    throw new Error(json.message || `Web3Forms returned ${res.status}`);
  }
}
