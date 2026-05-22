// ---------------------------------------------------------------------------
// Vite Configuration — SOC Dashboard SPA
// ---------------------------------------------------------------------------
// Replaces Create React App (deprecated) with Vite for:
//   - Faster HMR during development
//   - Smaller, optimized production bundles
//   - ESM-native build pipeline
//   - Proxy configuration for backend API
// ---------------------------------------------------------------------------

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],

  root: '.',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          msal: ['@azure/msal-browser', '@azure/msal-react'],
        },
      },
    },
  },
});
