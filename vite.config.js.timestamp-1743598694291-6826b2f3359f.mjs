// vite.config.js
import { VitePWA } from "file:///Users/webius/bg_soft/current_projects/traffic_system/its_maplibre/node_modules/vite-plugin-pwa/dist/index.js";
import { defineConfig } from "file:///Users/webius/bg_soft/current_projects/traffic_system/its_maplibre/node_modules/vite/dist/node/index.js";

// public/manifest.js
var manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssets: [
    "favicon.ico",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png"
  ],
  manifest: {
    name: "Intelligent Transportation System",
    short_name: "ITS",
    description: "Intelligent Transportation System",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "any"
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,png,svg,ico,txt}"]
  }
};
var manifest_default = manifestForPlugIn;

// vite.config.js
import mkcert from "file:///Users/webius/bg_soft/current_projects/traffic_system/its_maplibre/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import react from "file:///Users/webius/bg_soft/current_projects/traffic_system/its_maplibre/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  // server: {
  //   https: {
  //     key: "./key.pem",
  //     cert: "./cert.pem",
  //   },
  // },
  server: { https: true, hmr: { overlay: false } },
  define: {
    "process.env": {}
  },
  plugins: [react(), mkcert(), VitePWA(manifest_default)],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }]
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
    include: ["leaflet-polylinedecorator"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicHVibGljL21hbmlmZXN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlYml1cy9iZ19zb2Z0L2N1cnJlbnRfcHJvamVjdHMvdHJhZmZpY19zeXN0ZW0vaXRzX21hcGxpYnJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2ViaXVzL2JnX3NvZnQvY3VycmVudF9wcm9qZWN0cy90cmFmZmljX3N5c3RlbS9pdHNfbWFwbGlicmUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlYml1cy9iZ19zb2Z0L2N1cnJlbnRfcHJvamVjdHMvdHJhZmZpY19zeXN0ZW0vaXRzX21hcGxpYnJlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgbWFuaWZlc3RGb3JQbHVnSW4gZnJvbSBcIi4vcHVibGljL21hbmlmZXN0XCI7XG5pbXBvcnQgbWtjZXJ0IGZyb20gXCJ2aXRlLXBsdWdpbi1ta2NlcnRcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gc2VydmVyOiB7XG4gIC8vICAgaHR0cHM6IHtcbiAgLy8gICAgIGtleTogXCIuL2tleS5wZW1cIixcbiAgLy8gICAgIGNlcnQ6IFwiLi9jZXJ0LnBlbVwiLFxuICAvLyAgIH0sXG4gIC8vIH0sXG4gIHNlcnZlcjogeyBodHRwczogdHJ1ZSwgaG1yOiB7IG92ZXJsYXk6IGZhbHNlIH0gfSxcbiAgZGVmaW5lOiB7XG4gICAgXCJwcm9jZXNzLmVudlwiOiB7fSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1rY2VydCgpLCBWaXRlUFdBKG1hbmlmZXN0Rm9yUGx1Z0luKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW3sgZmluZDogXCJAXCIsIHJlcGxhY2VtZW50OiBcIi9zcmNcIiB9XSxcbiAgfSxcblxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbXCJqcy1iaWctZGVjaW1hbFwiXSxcbiAgICBpbmNsdWRlOiBbXCJsZWFmbGV0LXBvbHlsaW5lZGVjb3JhdG9yXCJdLFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93ZWJpdXMvYmdfc29mdC9jdXJyZW50X3Byb2plY3RzL3RyYWZmaWNfc3lzdGVtL2l0c19tYXBsaWJyZS9wdWJsaWNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93ZWJpdXMvYmdfc29mdC9jdXJyZW50X3Byb2plY3RzL3RyYWZmaWNfc3lzdGVtL2l0c19tYXBsaWJyZS9wdWJsaWMvbWFuaWZlc3QuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlYml1cy9iZ19zb2Z0L2N1cnJlbnRfcHJvamVjdHMvdHJhZmZpY19zeXN0ZW0vaXRzX21hcGxpYnJlL3B1YmxpYy9tYW5pZmVzdC5qc1wiO2NvbnN0IG1hbmlmZXN0Rm9yUGx1Z0luID0ge1xuICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICBpbmNsdWRlQXNzZXRzOiBbXG4gICAgXCJmYXZpY29uLmljb1wiLFxuICAgIFwiYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmdcIixcbiAgICBcImFuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gIF0sXG4gIG1hbmlmZXN0OiB7XG4gICAgbmFtZTogXCJJbnRlbGxpZ2VudCBUcmFuc3BvcnRhdGlvbiBTeXN0ZW1cIixcbiAgICBzaG9ydF9uYW1lOiBcIklUU1wiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkludGVsbGlnZW50IFRyYW5zcG9ydGF0aW9uIFN5c3RlbVwiLFxuICAgIGljb25zOiBbXG4gICAgICB7XG4gICAgICAgIHNyYzogXCIvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmdcIixcbiAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICBwdXJwb3NlOiBcImFueVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3JjOiBcIi9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ1wiLFxuICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgIHB1cnBvc2U6IFwiYW55XCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgdGhlbWVfY29sb3I6IFwiIzE3MTcxN1wiLFxuICAgIGJhY2tncm91bmRfY29sb3I6IFwiI2YwZTdkYlwiLFxuICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxuICAgIHNjb3BlOiBcIi9cIixcbiAgICBzdGFydF91cmw6IFwiL1wiLFxuICAgIG9yaWVudGF0aW9uOiBcImFueVwiLFxuICB9LFxuICB3b3JrYm94OiB7XG4gICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxwbmcsc3ZnLGljbyx0eHR9XCJdLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFuaWZlc3RGb3JQbHVnSW47XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLFNBQVMsZUFBZTtBQUNoWixTQUFTLG9CQUFvQjs7O0FDRDBXLElBQU0sb0JBQW9CO0FBQUEsRUFDL1osY0FBYztBQUFBLEVBQ2QsZUFBZTtBQUFBLElBQ2I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRjtBQUFBLElBQ0EsYUFBYTtBQUFBLElBQ2Isa0JBQWtCO0FBQUEsSUFDbEIsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGNBQWMsQ0FBQyxvQ0FBb0M7QUFBQSxFQUNyRDtBQUNGO0FBRUEsSUFBTyxtQkFBUTs7O0FEbENmLE9BQU8sWUFBWTtBQUNuQixPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPMUIsUUFBUSxFQUFFLE9BQU8sTUFBTSxLQUFLLEVBQUUsU0FBUyxNQUFNLEVBQUU7QUFBQSxFQUMvQyxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsUUFBUSxnQkFBaUIsQ0FBQztBQUFBLEVBQ3ZELFNBQVM7QUFBQSxJQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxhQUFhLE9BQU8sQ0FBQztBQUFBLEVBQzVDO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsZ0JBQWdCO0FBQUEsSUFDMUIsU0FBUyxDQUFDLDJCQUEyQjtBQUFBLEVBQ3ZDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
