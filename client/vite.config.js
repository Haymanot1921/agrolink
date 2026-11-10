// client/vite.config.js
// Vite configuration for AgroLink Ethiopia web app.
// SRS refs: §3.3 (React + Vite), §9.2 (React + Vite web client).

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// ─────────────────────────────────────────────────────────────
// https://vitejs.dev/config/
// ─────────────────────────────────────────────────────────────

export default defineConfig(({ mode }) => {
  // Load env from .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd(), '');

  const apiUrl = env.VITE_API_URL || 'http://localhost:5000/api/v1';
  const socketUrl = env.VITE_SOCKET_URL || 'http://localhost:5000';
  const appName = env.VITE_APP_NAME || 'AgroLink Ethiopia';

  // Derive socket origin (strip /api/v1 if present)
  const socketOrigin = socketUrl.replace(/\/api\/v\d+.*$/, '');

  return {
    plugins: [
      react({
        // Fast Refresh works for .jsx and .tsx
        include: '**/*.{jsx,tsx}',
        babel: {
          plugins: [
            // Reanimated-style animation support is mobile-only;
            // web uses CSS/Framer Motion — no extra Babel plugins needed.
          ],
        },
      }),
      svgr({
        // Import .svg as React components: `import { ReactComponent as Logo } from './logo.svg'`
        svgrOptions: {
          icon: true,
          svgo: true,
          svgoConfig: {
            plugins: [{ name: 'removeViewBox', active: false }],
          },
        },
        include: '**/*.svg?react',
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@app': path.resolve(__dirname, './src/app'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@modules': path.resolve(__dirname, './src/modules'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@components': path.resolve(__dirname, './src/shared/components'),
        '@hooks': path.resolve(__dirname, './src/shared/hooks'),
        '@services': path.resolve(__dirname, './src/shared/services'),
        '@utils': path.resolve(__dirname, './src/shared/utils'),
        '@constants': path.resolve(__dirname, './src/shared/constants'),
        '@styles': path.resolve(__dirname, './src/shared/styles'),
        '@store': path.resolve(__dirname, './src/shared/store'),
        '@i18n': path.resolve(__dirname, './src/i18n'),
        '@assets': path.resolve(__dirname, './public'),
      },
    },

    // ─────────────────────────────────────────────────────────
    // Dev server (SRS §17.1 — separate dev/test/prod)
    // ─────────────────────────────────────────────────────────
    server: {
      port: 5173,
      strictPort: false,
      host: true, // listen on all interfaces (needed for mobile emulator testing)
      open: false,
      cors: true,
      proxy: {
        // Proxy API calls during dev to avoid CORS headaches
        '/api': {
          target: socketOrigin,
          changeOrigin: true,
          secure: false,
        },
        // Proxy Socket.IO (SRS §5.11, §5.12)
        '/socket.io': {
          target: socketOrigin,
          changeOrigin: true,
          ws: true,
        },
        // Proxy uploaded files in dev (SRS §13.3)
        '/uploads': {
          target: socketOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ─────────────────────────────────────────────────────────
    // Preview (for `npm run preview`)
    // ─────────────────────────────────────────────────────────
    preview: {
      port: 4173,
      strictPort: false,
      host: true,
    },

    // ─────────────────────────────────────────────────────────
    // Build (SRS §17.1)
    // ─────────────────────────────────────────────────────────
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: 'esbuild',
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 800, // KB
      rollupOptions: {
        output: {
          // Split into cacheable chunks
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            'query': ['@tanstack/react-query'],
            'i18n': ['i18next', 'react-i18next'],
            'charts': ['recharts'],
            'maps': ['leaflet', 'react-leaflet'],
            'forms': ['react-hook-form', 'zod'],
            'socket': ['socket.io-client'],
            'utils': ['axios', 'date-fns', 'zustand'],
          },
          // Hash-based naming for cache busting
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    // ─────────────────────────────────────────────────────────
    // Environment
    // ─────────────────────────────────────────────────────────
    define: {
      __APP_NAME__: JSON.stringify(appName),
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __DEV__: mode !== 'production',
      // Prevent runtime errors from accidentally undefined globals
      global: 'globalThis',
    },

    // ─────────────────────────────────────────────────────────
    // Optimization
    // ─────────────────────────────────────────────────────────
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'axios',
        'i18next',
        'react-i18next',
        'zustand',
        'socket.io-client',
        'date-fns',
        'react-hook-form',
        'zod',
      ],
      exclude: ['react-leaflet'],
    },

    // ─────────────────────────────────────────────────────────
    // CSS
    // ─────────────────────────────────────────────────────────
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        // Extendable for SCSS if used
        scss: {
          additionalData: `@use "@/shared/styles/variables.scss" as *;`,
        },
      },
    },
  };
});