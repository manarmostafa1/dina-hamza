import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /* The big libraries get their own files: the app chunk drops under
           Vite's 500 kB warning, and a site update doesn't make returning
           visitors re-download React / framer-motion / gsap. */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          gsap: ["gsap", "lenis"],
        },
      },
    },
  },
});
