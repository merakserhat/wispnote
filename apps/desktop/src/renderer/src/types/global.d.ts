import { TWispBridge } from 'shared/types/ipc.types';

declare global {
  interface Window {
    wisp: TWispBridge;
  }
}

export {};

declare module 'csstype' {
  interface Properties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}
