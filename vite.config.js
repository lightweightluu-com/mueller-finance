import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// App-Name und Farben hier anpassen – sie landen im Web-App-Manifest.
const APP_NAME = 'Müller Finance';
const APP_SHORT_NAME = 'Müller Finance';
const THEME_COLOR = '#0b2a21';
const BACKGROUND_COLOR = '#07201a';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: APP_NAME,
        short_name: APP_SHORT_NAME,
        lang: 'de',
        description: 'Buchhaltung, Personalwesen und Steuern – kompetent, zuverlässig und persönlich.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: THEME_COLOR,
        background_color: BACKGROUND_COLOR,
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}']
      }
    })
  ]
});
