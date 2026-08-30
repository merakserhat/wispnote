import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

/**
 * Three builds, one config.
 *
 * `shared/` is aliased in all of them: the bridge frame types are the contract
 * between the engine, the main process and the renderer, so all three resolve
 * it the same way.
 */
const shared = resolve(__dirname, 'src/shared');

export default defineConfig({
  main: {
    resolve: {
      alias: { shared },
    },
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/main/main.ts') },
      },
    },
  },
  preload: {
    resolve: {
      alias: { shared },
    },
    build: {
      rollupOptions: {
        input: { preload: resolve(__dirname, 'src/preload/preload.ts') },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    resolve: {
      alias: {
        shared,
        components: resolve(__dirname, 'src/renderer/src/components'),
        screens: resolve(__dirname, 'src/renderer/src/screens'),
        hooks: resolve(__dirname, 'src/renderer/src/hooks'),
        context: resolve(__dirname, 'src/renderer/src/context'),
        helpers: resolve(__dirname, 'src/renderer/src/helpers'),
        theme: resolve(__dirname, 'src/renderer/src/theme'),
        types: resolve(__dirname, 'src/renderer/src/types'),
      },
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          panel: resolve(__dirname, 'src/renderer/panel.html'),
          hud: resolve(__dirname, 'src/renderer/hud.html'),
        },
      },
    },
  },
});
