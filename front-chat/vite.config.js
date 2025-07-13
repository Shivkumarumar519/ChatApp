import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // 👈 allows access from LAN (phone)
    port: 5173,        // optional: use any port
  },
})
