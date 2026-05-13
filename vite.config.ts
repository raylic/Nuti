import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Nuti/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['nuti-icon.svg'],
      manifest: {
        name: 'Nuti',
        short_name: 'Nuti',
        description: '营养摄入追踪',
        theme_color: '#E54D2E',
        background_color: '#FFF8F7',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/nuti-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
