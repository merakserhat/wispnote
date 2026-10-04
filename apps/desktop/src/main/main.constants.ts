import { app } from 'electron';
import path from 'path';

export const PYTHON_APP = app.isPackaged
  ? path.join(process.resourcesPath, 'engine')
  : path.resolve(__dirname, '../../engine');

export const ENGINE_HEARTBEAT_SECONDS = '2';

export const VERBOSE = Boolean(process.env.WISPNOTE_VERBOSE);
