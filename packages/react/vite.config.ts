import react from '@vitejs/plugin-react';
import { defineConfig, esmExternalRequirePlugin } from 'vite';
import banner from 'vite-plugin-banner';
import dts from 'unplugin-dts/vite';

const header = `/*! @viselect/react v${process.env.npm_package_version} MIT | https://github.com/simonwep/viselect/tree/master/packages/react */`;

export default defineConfig((env) => ({
  root: env.mode === 'production' ? '.' : './demo',

  plugins: [react(), banner(header), dts({ tsconfigPath: './tsconfig.app.json' })],

  build: {
    sourcemap: true,
    minify: 'esbuild',
    lib: {
      entry: 'src/index.tsx',
      name: 'SelectionArea',
      fileName: 'viselect'
    },
    rolldownOptions: {
      external: ['react-dom', '@viselect/vanilla'],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
          'react-dom': 'ReactDOM',
          '@viselect/vanilla': 'SelectionArea'
        }
      },
      // https://github.com/vitejs/rolldown-vite/issues/596
      plugins: [
        esmExternalRequirePlugin({
          external: ['react', 'react/jsx-runtime']
        })
      ]
    }
  },

  server: {
    port: 3006
  },

  define: {
    VERSION: JSON.stringify(process.env.npm_package_version)
  }
}));
