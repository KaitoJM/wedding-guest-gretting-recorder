// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : [])
  ],

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

  devServer: {
    host: '127.0.0.1',
    port: Number(process.env.NUXT_PORT || 3107),
  },

  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: false,
    },

    manifest: {
      name: 'Video Greetings',
      short_name: 'Greetings',
      description: 'Record and send video greetings',
      theme_color: '#111827',
      background_color: '#111827',
      display: 'fullscreen', // 👈 removes address bar when installed
      start_url: '/',
      scope: '/',
      orientation: 'portrait',
      icons: [
        {
          src: '/temp-logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/temp-logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      serverAPI: process.env.SERVER_API || 'http://localhost:3001',
      serverPort: process.env.SERVER_PORT || '3001',
    },
  },
});
