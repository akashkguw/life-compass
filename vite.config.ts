import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/life-compass/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Life Compass',
        short_name: 'Compass',
        description: 'Your personal life tracking & coaching companion',
        theme_color: '#6366f1',
        background_color: '#fafaf9',
        display: 'standalone',
        scope: '/life-compass/',
        start_url: '/life-compass/',
        icons: [
          {
            src: '/life-compass/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/life-compass/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/life-compass/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
