import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/wasan-marketplace/' : '/',
  server: {
    host: '127.0.0.1',
    port: 5174,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  plugins: [react()],
}))
