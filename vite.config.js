import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,       // You can change this if needed
    open: true,       // Automatically open in browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true,  // Optional: helps with debugging
  },
  define: {
    'process.env': process.env, // For environment variables
  },
}); 
