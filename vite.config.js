import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    base: '/',           // ← এটা গুরুত্বপূর্ণ
      build: {
          outDir: 'dist'
            }
            })
            
