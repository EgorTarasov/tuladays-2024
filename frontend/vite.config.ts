import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

const target = "https://tula.larek.tech/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#FFF",
      },
    }),
  ],
  build: {
    target: "esnext",
    outDir: "../backend/static",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      api: path.resolve(__dirname, "./src/api"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
