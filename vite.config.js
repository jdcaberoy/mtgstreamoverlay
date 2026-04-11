import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH env var for GitHub Pages deployment
// e.g. VITE_BASE_PATH=/tournament-overlay/ npm run build
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base,
})
