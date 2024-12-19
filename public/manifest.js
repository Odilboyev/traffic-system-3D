const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssets: [
    "favicon.ico",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
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
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "any",
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,png,svg,ico,txt}"],
  },
};

export default manifestForPlugIn;
