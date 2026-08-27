import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import dts from 'unplugin-dts/vite';

const header = `/*! @viselect/vanilla v${process.env.npm_package_version} MIT | https://github.com/simonwep/viselect/tree/master/packages/vanilla */`;

export default defineConfig((env) => ({
  root: env.mode === 'production' ? '.' : './demo',

  plugins: [banner(header), dts({ tsconfigPath: './tsconfig.app.json' })],

  build: {
    sourcemap: true,
    minify: 'esbuild',
    lib: {
      entry: 'src/index.ts',
      name: 'SelectionArea',
      fileName: 'viselect'
    }
  },

  server: {
    port: 3005
  },

  define: {
    VERSION: JSON.stringify(process.env.npm_package_version)
  }
}));
