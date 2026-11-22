import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'electron-vite';
import { resolve } from 'path';

import { rendererAlias, sharedAlias } from './vite.aliases';

/**
 * Three builds, one config.
 *
 * `shared/` is aliased in all of them: the bridge frame types are the contract
 * between the engine, the main process and the renderer, so all three resolve
 * it the same way.
 */

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'WISPNOTE_');

  return {
    main: {
      define: {
        'process.env.WISPNOTE_API_URL': JSON.stringify(env.WISPNOTE_API_URL),
        'process.env.WISPNOTE_GOOGLE_CLIENT_ID': JSON.stringify(env.WISPNOTE_GOOGLE_CLIENT_ID),
      },
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
            hud: resolve(__dirname, 'src/renderer/hud.html'),
            main: resolve(__dirname, 'src/renderer/main.html'),
            paste: resolve(__dirname, 'src/renderer/paste.html'),
          },
        },
      },
    },
  };
});
