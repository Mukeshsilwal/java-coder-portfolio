import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // PWA Plugin Disabled - Removes offline page and service worker
    // VitePWA({
    //   registerType: 'prompt',
    //   includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt', 'placeholder.svg'],
    //   manifest: {
    //     name: 'Java Developer Portfolio',
    //     short_name: 'Portfolio',
    //     description: 'Java Backend Software Engineer specializing in Spring Boot, Reactive Programming, and Fintech solutions',
    //     theme_color: '#1e3a8a',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     orientation: 'portrait-primary',
    //     scope: '/',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: '/icons/icon-72x72.png',
    //         sizes: '72x72',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: '/icons/icon-96x96.png',
    //         sizes: '96x96',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: '/icons/icon-128x128.png',
    //         sizes: '128x128',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: '/icons/icon-144x144.png',
    //         sizes: '144x144',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: '/icons/icon-152x152.png',
    //         sizes: '152x152',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: '/icons/icon-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       },
    //       {
    //         src: '/icons/icon-384x384.png',
    //         sizes: '384x384',
    //         type: 'image/png',
    //         purpose: 'any'
    //       },
    //       {
    //         src: '/icons/icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       }
    //     ],
    //     shortcuts: [
    //       {
    //         name: 'Projects',
    //         short_name: 'Projects',
    //         description: 'View my projects',
    //         url: '/projects',
    //         icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
    //       },
    //       {
    //         name: 'Experience',
    //         short_name: 'Experience',
    //         description: 'View my experience',
    //         url: '/experience',
    //         icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
    //       },
    //       {
    //         name: 'Skills',
    //         short_name: 'Skills',
    //         description: 'View my skills',
    //         url: '/skills',
    //         icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'google-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200]
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'gstatic-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200]
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
    //         handler: 'StaleWhileRevalidate',
    //         options: {
    //           cacheName: 'cloudinary-images',
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200]
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /\/api\/.*/i,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'api-cache',
    //           networkTimeoutSeconds: 10,
    //           expiration: {
    //             maxEntries: 50,
    //             maxAgeSeconds: 60 * 5 // 5 minutes
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200]
    //           }
    //         }
    //       }
    //     ],
    //     navigateFallback: '/offline.html',
    //     navigateFallbackDenylist: [/^\/api/],
    //     cleanupOutdatedCaches: true,
    //     skipWaiting: false,
    //     clientsClaim: true
    //   },
    //   devOptions: {
    //     enabled: true,
    //     type: 'module',
    //     navigateFallback: 'index.html'
    //   }
    // })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
