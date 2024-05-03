import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { createServer } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  // server: {
  //   https: {
  //     key: "./key.pem",
  //     cert: "./cert.pem",
  //   },
  // },
  // server: { https: true },
  define: {
    "process.env": {},
  },
  plugins: [
    react(),
    // mkcert(),
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
