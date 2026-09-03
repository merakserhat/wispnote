/**
 * The terminal log.
 *
 * The engine runs headless, so this is the only place its behaviour is visible
 * while the UI is still thin. One line per event, columns aligned, so a capture
 * reads top to bottom.
 */
const CHANNEL_WIDTH = 9;

const stamp = (): string =>
  [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

export type TLogChannel =
  | 'host'
  | 'engine'
  | 'shortcut'
  | 'trigger'
  | 'capture'
  | 'db'
  | 'result'
  | 'python'
  | 'api'
  | 'auth'
  | 'error'
  | 'beat';

export const log = (channel: TLogChannel, message: string): void => {
  console.log(`${stamp()}  ${channel.padEnd(CHANNEL_WIDTH)}${message}`);
};
