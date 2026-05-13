import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    base: '/',           // ← এটা সবচেয়ে গুরুত্বপূর্ণ (custom domain-এর জন্য)
      build: {
          outDir: 'dist',
              emptyOutDir: true
                }
                })

