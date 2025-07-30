import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Only use GitHub Pages base path when specifically building for GitHub
  const isGitHubPages = mode === 'github'
  
  return {
    plugins: [
      react()
    ],
    // Set correct base path for GitHub Pages only
    base: isGitHubPages ? '/energy-timeline/' : '/',
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 3000,
    },
  }
})