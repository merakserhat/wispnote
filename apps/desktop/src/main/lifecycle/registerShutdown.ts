import { TRegisterShutdownParams } from './registerShutdown.types';
import { EXIT_SIGNALS } from './registerShutdown.constants';

export function registerShutdown({ app, engine }: TRegisterShutdownParams): void {
  let isQuitting = false;

  async function shutdown(): Promise<void> {
    if (isQuitting) {
      return;
    }

    isQuitting = true;
    // INFO: (serhat) a surviving engine keeps the Fn event tap with no UI attached, which breaks the key system-wide.
    await engine.stop();
    app.exit(0);
  }

  // INFO: (serhat) the host outlives its windows - closing them all must not quit.
  app.on('window-all-closed', () => {});

  app.on('before-quit', (event: Electron.Event) => {
    if (isQuitting) {
      return;
    }

    event.preventDefault();
    shutdown();
  });

  EXIT_SIGNALS.forEach((signal) => {
    process.on(signal, () => {
      shutdown();
    });
  });
}
