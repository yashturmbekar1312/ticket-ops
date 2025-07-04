import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Large libraries that should be separate
            if (id.includes('@mui/material')) {
              return 'mui-core';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('@emotion')) {
              return 'emotion';
            }
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Redux ecosystem
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // Form libraries
            if (id.includes('formik') || id.includes('yup')) {
              return 'form-vendor';
            }
            // Utility libraries
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            if (id.includes('date-fns')) {
              return 'date-vendor';
            }
            if (id.includes('jwt-decode') || id.includes('react-hot-toast')) {
              return 'utils-vendor';
            }
            // Other node modules
            return 'vendor';
          }

          // App code chunking
          if (id.includes('src/pages')) {
            return 'pages';
          }
          if (id.includes('src/components/layout')) {
            return 'layout';
          }
          if (id.includes('src/components')) {
            return 'components';
          }
          if (id.includes('src/redux')) {
            return 'store';
          }
          if (id.includes('src/services')) {
            return 'services';
          }
          if (id.includes('src/utils') || id.includes('src/hooks')) {
            return 'utils';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  },
});
