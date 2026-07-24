import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/study-room/', // Replace 'your-repo-name' with your actual GitHub repository name
  plugins: [
    react(),
    tailwindcss(),
  ],
})