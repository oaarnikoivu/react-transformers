import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
      include: ['lib/**/*'],
    }),
  ],
  worker: {
    format: 'es',
    rollupOptions: {
      external: ['@huggingface/transformers'],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `react-transformers.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@huggingface/transformers'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@huggingface/transformers': 'Transformers',
        },
      },
    },
  },
});
