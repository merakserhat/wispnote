import { app } from 'electron';
import path from 'path';

export const ENGINE_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'engine')
  : path.resolve(__dirname, '../../engine');

export const ENGINE_BINARY = app.isPackaged
  ? path.join(ENGINE_DIR, 'wispnote-engine')
  : path.join(ENGINE_DIR, '.build/release/wispnote-engine');

export const ENGINE_HEARTBEAT_SECONDS = '2';

export const VERBOSE = Boolean(process.env.WISPNOTE_VERBOSE);
