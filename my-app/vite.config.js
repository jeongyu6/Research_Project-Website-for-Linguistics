import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Research_Project-Website-for-Linguistics/',
  plugins: [react()],
})
