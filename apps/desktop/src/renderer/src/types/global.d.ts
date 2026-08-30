import { TWispBridge } from 'shared/types/ipc.types';

declare global {
  interface Window {
    wisp: TWispBridge;
  }
}

export {};
