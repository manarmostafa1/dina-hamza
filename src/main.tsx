import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "./App";
import "./index.css";

/* ------------------------------------------------------------------ *
 *  Every load and every refresh starts at the very top, on every page.
 *
 *  1. The browser must not restore the old scroll position.
 *  2. A hash left over from an in-page nav click (/#contact) is dropped
 *     BEFORE the router reads the URL, so a refresh doesn't jump to that
 *     section. (Nav clicks during the visit still push a hash and scroll
 *     — see HashHandler in App.tsx.)
 *  3. Jump to the top instantly, then once more when everything has
 *     loaded (late images can shift the page), and re-measure the GSAP
 *     triggers so the footer reveal starts from the right state.
 *  Route changes scroll to the top in SmoothScroll.tsx.
 * ------------------------------------------------------------------ */
/* ScrollTrigger manages history.scrollRestoration itself: it saves the
   value it finds when registered (during the imports above, i.e. "auto")
   and writes it back on every refresh. clearScrollMemory("manual") sets
   it through ScrollTrigger so that saved value is "manual" too. */
gsap.registerPlugin(ScrollTrigger);
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
ScrollTrigger.clearScrollMemory("manual");
if (location.hash) {
  history.replaceState(history.state, "", location.pathname + location.search);
}
const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
toTop();
window.addEventListener(
  "load",
  () => {
    toTop();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  },
  { once: true }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
