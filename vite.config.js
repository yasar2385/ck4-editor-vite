import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default ({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    define: {
      'process.env': env, // so process.env.MY_KEY works in code
    },
    css: {
      postcss: './postcss.config.js', // ensure Tailwind runs
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      host: true, // ensures accessibility from LAN / Docker if needed
    },
  });
};
