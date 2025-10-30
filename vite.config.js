import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Inject your API key safely at proxy level
            const key = process.env.VITE_GEMINI_KEY;
            const url = new URL(proxyReq.path, "https://generativelanguage.googleapis.com");
            url.searchParams.set("key", key);
            proxyReq.path = url.pathname + url.search;
          });
        },
      },
    },
  },
});
