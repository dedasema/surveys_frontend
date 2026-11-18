/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: false,
    },
    build: {
      outDir: 'build',
      sourcemap: false,
    },
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(apiUrl),
      'process.env.PUBLIC_URL': JSON.stringify(''),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.js'],
    },
  };
});
