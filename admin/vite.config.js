import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Admin panel on port 5173
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend on port 3001
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
