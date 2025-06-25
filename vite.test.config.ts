import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite pour le test du ThemeToggle
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: 'test-theme-toggle.html'
      }
    }
  },
  server: {
    port: 3001,
    open: '/test-theme-toggle.html'
  }
})
