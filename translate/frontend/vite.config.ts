import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/compare/api/": {
        // The translation backend; see dev.sh (stt runs on 8000, tts on 8001).
        target: process.env.BACKEND_URL ?? "http://127.0.0.1:8002",
        changeOrigin: true,
        ws: true, // WebSocket proxying
      },
    },
  },
});
