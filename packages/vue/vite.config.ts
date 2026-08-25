import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import banner from 'vite-plugin-banner';
import pkg from './package.json' with { type: 'json' };

const header = `/*! @viselect/vue v${pkg.version} MIT | https://github.com/simonwep/viselect/tree/master/packages/vue */`;

export default defineConfig((env) => ({
  root: env.mode === 'production' ? '.' : './demo',

  plugins: [vue(), banner(header), dts({ tsconfigPath: './tsconfig.app.json' })],

  build: {
    sourcemap: true,
    minify: 'esbuild',
    lib: {
      entry: 'src/index.ts',
      name: 'SelectionArea',
      fileName: 'viselect'
    },
    rolldownOptions: {
      external: ['vue', '@viselect/vanilla'],
      output: {
        globals: {
          vue: 'Vue',
          '@viselect/vanilla': 'SelectionArea'
        }
      }
    }
  },

  resolve: {
    alias: {
      '@vanilla': resolve(process.cwd(), '../vanilla/src')
    }
  },

  server: {
    port: 3008
  },

  define: {
    VERSION: JSON.stringify(pkg.version)
  }
}));
