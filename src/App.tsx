import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SmoothScroll, scrollToId } from "@/components/shell/SmoothScroll";
import { Navbar } from "@/components/shell/Navbar";
import { Loader } from "@/components/shell/Loader";
import { ScrollProgress } from "@/components/shell/ScrollProgress";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Work from "@/pages/Work";

/** Scrolls to a section when the URL carries a hash (e.g. /#work). */
function HashHandler() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (pathname === "/" && hash) {
      const id = hash.replace("#", "");
      const t = setTimeout(() => scrollToId(id), 300);
      return () => clearTimeout(t);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <SmoothScroll>
      {/* The loader is an overlay; it no longer gates the page's own
          opacity. Holding the content at opacity:0 while it was already
          laid out meant every scroll-entrance near the top of the page
          fired behind the curtain and had finished by the time it was
          lifted — which is why things appeared to "pop in late". */}
      <Loader />
      <ScrollProgress />
      <Navbar />
      <HashHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </SmoothScroll>
  );
}
