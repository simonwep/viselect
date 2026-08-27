import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import dts from 'unplugin-dts/vite';

const header = `/*! @viselect/preact v${process.env.npm_package_version} MIT | https://github.com/simonwep/viselect/tree/master/packages/preact */`;

export default defineConfig((env) => ({
  root: env.mode === 'production' ? '.' : './demo',

  plugins: [preact(), banner(header), dts({ tsconfigPath: './tsconfig.app.json' })],

  build: {
    sourcemap: true,
    minify: 'esbuild',
    lib: {
      entry: 'src/index.tsx',
      name: 'SelectionArea',
      fileName: 'viselect'
    },
    rolldownOptions: {
      external: ['preact', 'preact/hooks', '@viselect/vanilla'],
      output: {
        globals: {
          preact: 'preact',
          'preact/hooks': 'preactHooks',
          '@viselect/vanilla': 'SelectionArea'
        }
      }
    }
  },

  server: {
    port: 3006
  },

  define: {
    VERSION: JSON.stringify(process.env.npm_package_version)
  }
}));
