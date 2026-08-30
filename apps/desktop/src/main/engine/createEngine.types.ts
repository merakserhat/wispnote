import { TTriggerFrame } from 'shared/types/engine.types';

import { HudWindow } from '../windows';

export type TCreateEngineProps = {
  app: Electron.App;
  hud: HudWindow;
  onTrigger: (frame: TTriggerFrame) => void;
};
