import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/upload-replay': 'http://localhost:8000',
      '/grafico': 'http://localhost:8000',
    }
  }
});
