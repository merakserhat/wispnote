import { TCaptureHudPhase } from 'shared/types/captureHud.types';

export function isOpenPhase(phase: TCaptureHudPhase): boolean {
  return phase === 'basic' || phase === 'detailed';
}
