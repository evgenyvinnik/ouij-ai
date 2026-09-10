import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  appType: 'mpa',
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        about: path.resolve(import.meta.dirname, 'about.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
