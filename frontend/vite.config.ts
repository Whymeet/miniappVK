import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Оптимизация размера бандла
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Убираем console.log в продакшене
          drop_debugger: true,
        },
      },
      // Увеличиваем лимит для предупреждений о размере чанков
      chunkSizeWarningLimit: 1000,
    },
    define: {
      'import.meta.env.VITE_API_BASE': JSON.stringify(env.VITE_API_BASE || 'https://kybyshka-dev.ru'),
    },
  };
});

