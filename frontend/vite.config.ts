import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Определяем базовый путь для assets
  // Проверяем и переменные окружения, и .env файлы
  const platform = process.env.VITE_PLATFORM || env.VITE_PLATFORM;
  const basePath = platform === 'mobile' ? '/mob/' : '/';
  
  console.log('Vite config - Platform:', platform, 'Base path:', basePath);
  
  return {
    plugins: [react()],
    base: basePath,
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
    },
    define: {
      'import.meta.env.VITE_API_BASE': JSON.stringify(env.VITE_API_BASE || 'https://kybyshka-dev.ru'),
    },
  };
});

