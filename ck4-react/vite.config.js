import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/collaboration": {
        target: "ws://localhost:8025",
        ws: true,
      },
    },
  },
  build: {
    outDir: "../backend/src/main/resources/webapp",
    emptyOutDir: true,
  },
});
