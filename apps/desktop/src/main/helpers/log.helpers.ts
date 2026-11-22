import { app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * The terminal log.
 *
 * The engine runs headless, so this is the only place its behaviour is visible
 * while the UI is still thin. One line per event, columns aligned, so a capture
 * reads top to bottom.
 */
const CHANNEL_WIDTH = 9;
const LOG_FILE = 'main.log';

const stamp = (): string =>
  [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

export type TLogChannel =
  | 'host'
  | 'engine'
  | 'shortcut'
  | 'trigger'
  | 'hud'
  | 'paste'
  | 'capture'
  | 'db'
  | 'result'
  | 'api'
  | 'auth'
  | 'settings'
  | 'error'
  | 'beat';

function writeToFile(line: string): void {
  try {
    const directory = app.getPath('logs');
    fs.mkdirSync(directory, { recursive: true });
    fs.appendFileSync(
      path.join(directory, LOG_FILE),
      `${new Date().toLocaleDateString('en-CA')} ${line}\n`
    );
  } catch {
    // ignore
  }
}

export const log = (channel: TLogChannel, message: string): void => {
  const line = `${stamp()}  ${channel.padEnd(CHANNEL_WIDTH)}${message}`;
  console.log(line);

  if (app.isPackaged) {
    writeToFile(line);
  }
};
