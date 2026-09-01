import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works at https://<user>.github.io/<repo>/
// as well as on a custom domain, without hard-coding the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
