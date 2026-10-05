import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/', build: { chunkSizeWarningLimit: 1000, rollupOptions: { output: { manualChunks: (id) => /node_modules\/(three|@react-three|react-reconciler)/.test(id.replaceAll('\\','/')) ? 'world-engine' : undefined } } } });
