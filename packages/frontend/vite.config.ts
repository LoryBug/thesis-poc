import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE_URL || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cardiac Mass DSS',
        short_name: 'CM-DSS',
        description: 'Clinical Decision Support System for cardiac mass diagnosis',
        display: 'standalone',
        theme_color: '#173b68',
        background_color: '#173b68',
        start_url: base,
        icons: [
          { src: `${base}icons/192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}icons/512.png`, sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
