import { Engine } from '../engine';

export type TCreateTrayParams = {
  engine: Engine;
  onShowPanel: () => void;
  onOpenMainWindow: () => void;
};
