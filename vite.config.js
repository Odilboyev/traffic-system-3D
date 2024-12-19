import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import manifestForPlugIn from "./public/manifest";
import mkcert from "vite-plugin-mkcert";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // server: {
  //   https: {
  //     key: "./key.pem",
  //     cert: "./cert.pem",
  //   },
  // },
  server: { https: true, hmr: { overlay: false } },
  define: {
    "process.env": {},
  },
  plugins: [react(), mkcert(), VitePWA(manifestForPlugIn)],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },

  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
