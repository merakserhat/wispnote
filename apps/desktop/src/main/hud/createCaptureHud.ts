import { TRawCaptureContext } from 'shared/types/capture.types';
import {
  TCaptureHudIntent,
  TCaptureHudPhase,
  TCaptureHudResult,
  TCaptureHudState,
} from 'shared/types/captureHud.types';
import { TKeyFrame } from 'shared/types/engine.types';

import { log, toCaptureContext } from '../helpers';

import { isOpenPhase } from './captureHud.helpers';
import {
  HIDDEN_STATE,
  HIDE_MORPH_MS,
  KEYBOARD_DELAY_MS,
  RESULT_HOLD_MS,
  RESULT_MORPH_MS,
  RESULT_SWAP_MS,
} from './createCaptureHud.constants';
import { TCaptureHud, TCreateCaptureHudParams, TOpenHudFrame } from './createCaptureHud.types';

// INFO: (serhat) the capture HUD's state machine. Engine triggers, engine keys, action results and
// the timers all arrive in main, so the phase lives here; the renderer only animates what it is sent
// and keeps the draft text.
export function createCaptureHud({ engine, window }: TCreateCaptureHudParams): TCaptureHud {
  let state: TCaptureHudState = HIDDEN_STATE;
  let rawContext: TRawCaptureContext | null = null;
  let typed = false;
  let timer: NodeJS.Timeout | null = null;

  function clearTimer(): void {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function later(ms: number, run: () => void): void {
    clearTimer();
    timer = setTimeout(run, ms);
  }

  function move(next: TCaptureHudState, reason: string): void {
    const wasUp = state.phase !== 'hidden';
    const isUp = next.phase !== 'hidden';
    if (state.phase !== next.phase) {
      log('hud', `${state.phase} → ${next.phase} · ${reason}`);
    }

    state = next;
    window.render(state);
    if (wasUp !== isUp) {
      engine.notify('hud', { up: isUp });
    }
  }

  function hide(reason: string): void {
    if (state.phase === 'hidden') {
      return;
    }

    // INFO: (serhat) no blur here: hiding the window after the morph gives the keyboard back, and
    // blur would fade the window out while the shape is still shrinking.
    move({ ...state, phase: 'hidden' }, reason);
    window.setClickThrough(true);
    later(HIDE_MORPH_MS, () => window.hide());
  }

  function open(frame: TOpenHudFrame): void {
    if (isOpenPhase(state.phase)) {
      log('hud', 'capture ignored · a note is already open');
      return;
    }

    clearTimer();
    // INFO: (serhat) the window only moves when it grows from the seed; a capture that interrupts a
    // pill morphs in place.
    if (state.phase === 'hidden') {
      window.place();
    }

    rawContext = frame.context;
    typed = false;
    move(
      {
        phase: 'basic',
        captureId: state.captureId + 1,
        capture: { context: toCaptureContext(frame.context), canSync: frame.can_sync },
        result: null,
      },
      'capture'
    );
    window.showPassive();
    later(KEYBOARD_DELAY_MS, () => {
      if (isOpenPhase(state.phase)) {
        window.takeKeyboard();
      }
    });
  }

  function showResult(result: TCaptureHudResult): void {
    const swap = state.phase === 'result';
    clearTimer();

    if (state.phase === 'hidden') {
      window.place();
      window.showPassive();
    }

    // INFO: (serhat) after ↩ the pill keeps the keyboard until it hides: giving it back here would
    // fade the window out during the morph.
    move({ ...state, phase: 'result', result }, result.title);

    // INFO: (serhat) work in progress holds the pill; the timer starts when the outcome replaces it.
    if (result.icon !== 'spin') {
      later(RESULT_HOLD_MS + (swap ? RESULT_SWAP_MS : RESULT_MORPH_MS), () => hide('timer'));
    }
  }

  // INFO: (serhat) an outcome that arrives after the user opened a new capture must not replace the
  // note they are typing.
  function reportResult(result: TCaptureHudResult): void {
    if (isOpenPhase(state.phase)) {
      log('hud', `result not shown · ${result.title} · a new capture is open`);
      return;
    }
    showResult(result);
  }

  // INFO: (serhat) esc is deliberate, so it closes whatever is up, typed note included.
  function escape(): void {
    hide('esc');
  }

  // INFO: (serhat) a click away is not deliberate: it only closes an empty card. A card with a
  // note typed stays up, without the keyboard, until esc or ↩; clicking it takes the keyboard back.
  function handleBlur(): void {
    if (!isOpenPhase(state.phase)) {
      return;
    }
    if (typed) {
      log('hud', 'click away · note typed, card stays');
      return;
    }
    hide('click away');
  }

  function dismiss(): void {
    hide('dismissed');
  }

  function toggle(): void {
    if (state.phase === 'basic') {
      move({ ...state, phase: 'detailed' }, 'ctrl');
    } else if (state.phase === 'detailed') {
      move({ ...state, phase: 'basic' }, 'ctrl');
    }
  }

  function handleIntent(intent: TCaptureHudIntent): void {
    switch (intent.type) {
      case 'typed':
        if (isOpenPhase(state.phase)) {
          typed = intent.typed;
        }
        break;

      case 'pointer':
        window.setClickThrough(state.phase === 'hidden' || !intent.inside);
        break;

      default:
        break;
    }
  }

  function getContext(): TRawCaptureContext | null {
    return rawContext;
  }

  function getPhase(): TCaptureHudPhase {
    return state.phase;
  }

  function hasNote(): boolean {
    return typed;
  }

  window.onBlur(handleBlur);

  engine.on('key', (frame: TKeyFrame) => {
    if (frame.key === 'escape') {
      escape();
    } else {
      toggle();
    }
  });

  // INFO: (serhat) a restarted engine has forgotten that the HUD is up.
  engine.on('ready', () => {
    engine.notify('hud', { up: state.phase !== 'hidden' });
  });

  return {
    open,
    showResult,
    reportResult,
    escape,
    dismiss,
    handleIntent,
    getContext,
    getPhase,
    hasNote,
  };
}
