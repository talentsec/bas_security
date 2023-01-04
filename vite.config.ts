import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      include: "src/assets/icon/*.svg"
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@icon": path.resolve(__dirname, "src/assets/icon"),
      stream: "stream-browserify",
      path: "path-browserify",
      timers: "timers-browserify",
      buffer: "buffer"
    }
  },
  server: {
    hmr: true,
    proxy: {
      "/api": {
        target: "http://10.10.10.242:8051/",
        changeOrigin: true
      }
    }
  }
});
