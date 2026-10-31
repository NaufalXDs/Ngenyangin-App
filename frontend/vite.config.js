import 'dotenv/config';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 5173,
  },
  define: {
    'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || 'http://127.0.0.1:3000'),
  },
  plugins: [react(), tailwindcss()],
  base: "/",
})
