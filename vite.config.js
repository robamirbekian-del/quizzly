import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // When you add a backend server (Express / Next.js), point the dev
  // proxy here so API calls don't hit CORS issues during development.
  // Uncomment and update the target URL when you're ready:
  //
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3001',
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
