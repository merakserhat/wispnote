import { TRegisterShutdownProps } from './registerShutdown.types';

/**
 * Quitting means stopping the engine first.
 *
 * A surviving engine keeps the Fn event tap with no UI attached, which breaks
 * the key system-wide - so every exit route (menu, Ctrl+C, SIGTERM) funnels
 * through the same guarded shutdown.
 */
export const registerShutdown = ({ app, engine }: TRegisterShutdownProps): void => {
  let quitting = false;

  app.on('window-all-closed', () => {
    // Intentionally empty: this process outlives its windows.
  });

  const shutdown = async (): Promise<void> => {
    if (quitting) {
      return;
    }
    quitting = true;
    await engine.stop();
    app.exit(0);
  };

  app.on('before-quit', (event: Electron.Event) => {
    if (quitting) {
      return;
    }
    event.preventDefault();
    shutdown();
  });

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      shutdown();
    });
  });
};
