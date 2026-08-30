import {
  TDataFrame,
  TErrorFrame,
  THeartbeatFrame,
  TReadyFrame,
  TToastFrame,
  TTriggerFrame,
} from 'shared/types/engine.types';

import { describeCapture, log, previewSelection, toCaptureContext } from '../helpers';
import { ENGINE_HEARTBEAT_SECONDS, PYTHON_APP, VERBOSE } from '../main.constants';

import { Engine } from './Engine';
import { TCreateEngineProps } from './createEngine.types';

/**
 * The running engine, wired to this app.
 *
 * `Engine` is the mechanism - spawn, restart, speak the bridge protocol. This
 * is the policy: what gets logged, where a toast is drawn, what a trigger does.
 * Swapping either one out leaves the other alone.
 */
export const createEngine = ({ app, hud, onTrigger }: TCreateEngineProps): Engine => {
  const args = ['main.py', 'serve', '--heartbeat', ENGINE_HEARTBEAT_SECONDS];
  if (process.env.WISPNOTE_NO_TAP) {
    args.push('--no-tap');
  }

  const engine = new Engine({
    command: process.env.WISPNOTE_PYTHON || 'python3',
    args,
    cwd: PYTHON_APP,
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  });

  engine.on('log', (line: string) => log('python', line.replace(/^\[wispnote\]\s*/, '')));

  engine.on('status', (status: string) => {
    // `starting` and `running` are already implied by the `ready` line.
    if (status === 'unhealthy' || status === 'failed') {
      log('engine', `status: ${status}`);
    }
  });

  engine.on('ready', (frame: TReadyFrame) => {
    log('engine', `ready · pid ${frame.pid} · ${frame.data_dir}`);

    if (!frame.accessibility) {
      log('engine', 'accessibility DENIED — every capture will come back empty');
    }
    if (!frame.tap && !process.env.WISPNOTE_NO_TAP) {
      log('engine', `event tap OFF — ${frame.tap_error}`);
    }
    if (VERBOSE) {
      frame.triggers.forEach(({ trigger, action }) => {
        log('shortcut', `${trigger.padEnd(9)} → ${action}`);
      });
    }
  });

  engine.on('trigger', (frame: TTriggerFrame) => {
    log('trigger', `${frame.trigger} → ${frame.action}`);
    if (VERBOSE) {
      const context = toCaptureContext(frame.context);
      log('capture', describeCapture(context));
      log('capture', previewSelection(context));
    }
    onTrigger(frame);
  });

  engine.on('toast', (frame: TToastFrame) => {
    log('result', [frame.message, frame.detail].filter(Boolean).join('  ·  '));
    hud.show({ message: frame.message, detail: frame.detail });
  });

  engine.on('data', (frame: TDataFrame) => {
    log('db', `${frame.event}${frame.note_id ? ` · note ${frame.note_id}` : ''}`);
  });

  engine.on('error', (frame: TErrorFrame) => log('error', frame.message));

  engine.on('heartbeat', (frame: THeartbeatFrame) => {
    if (VERBOSE) {
      log('beat', `#${frame.seq} · up ${frame.uptime}s · tap ${frame.tap}`);
    }
  });

  engine.on('gave-up', (failures: number) => {
    log('engine', `gave up after ${failures} failed starts — quitting`);
    app.quit();
  });

  engine.start();
  return engine;
};
