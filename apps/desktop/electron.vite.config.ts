import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

import { rendererAlias, sharedAlias } from './vite.aliases';

/**
 * Three builds, one config.
 *
 * `shared/` is aliased in all of them: the bridge frame types are the contract
 * between the engine, the main process and the renderer, so all three resolve
 * it the same way.
 */

export default defineConfig({
  main: {
    resolve: {
      alias: sharedAlias(__dirname),
    },
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/main/main.ts') },
      },
    },
  },
  preload: {
    resolve: {
      alias: sharedAlias(__dirname),
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
      alias: rendererAlias(__dirname),
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          panel: resolve(__dirname, 'src/renderer/panel.html'),
          hud: resolve(__dirname, 'src/renderer/hud.html'),
          main: resolve(__dirname, 'src/renderer/main.html'),
        },
      },
    },
  },
});
