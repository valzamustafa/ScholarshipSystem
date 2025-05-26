import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve('./certs/key.pem')),
      cert: fs.readFileSync(path.resolve('./certs/cert.pem')),
    },
    port: 3000,
    strictPort: true, 
    proxy: {
      '/api': {
        target: 'https://localhost:7255',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})