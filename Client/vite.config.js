import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    },
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7255', // kjo është backend-i yt .NET
        changeOrigin: true,
        secure: false, // duhet të jetë false sepse ke certifikatë vetanake
      }
    }
  }
})
