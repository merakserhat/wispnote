import { Engine } from '../engine/Engine';

export type TRegisterShutdownParams = {
  app: Electron.App;
  engine: Engine;
};
