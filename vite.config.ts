import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isGitHubPages = mode === 'github' || process.env.GITHUB_ACTIONS === 'true'
  
  return {
    plugins: [
      react()
    ],
    // Set correct base path for GitHub Pages
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