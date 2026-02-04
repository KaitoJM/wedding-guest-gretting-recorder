// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/eslint", "@nuxt/ui", "@vite-pwa/nuxt"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  nitro: {
    host: "0.0.0.0", // 👈 Bind to all interfaces (IPv4 and IPv6)
  },

  pwa: {
    registerType: "autoUpdate",

    manifest: {
      name: "Video Greetings",
      short_name: "Greetings",
      description: "Record and send video greetings",
      theme_color: "#111827",
      background_color: "#111827",
      display: "fullscreen", // 👈 removes address bar when installed
      start_url: "/",
      scope: "/",
      orientation: "portrait",
      icons: [
        {
          src: "/temp-logo-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/temp-logo-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      serverAPI: process.env.SERVER_API || "https://localhost",
      serverPort: process.env.SERVER_PORT || 3001,
    },
  },
});
