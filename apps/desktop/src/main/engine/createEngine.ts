import fs from 'fs';

import { ENGINE_PROTOCOL_VERSION } from 'shared/constants/engineProtocol';
import {
  TConfigureResult,
  TErrorFrame,
  THeartbeatFrame,
  TReadyFrame,
} from 'shared/types/engine.types';

import { log } from '../helpers';
import { ENGINE_BINARY, ENGINE_DIR, ENGINE_HEARTBEAT_SECONDS, VERBOSE } from '../main.constants';

import { Engine } from './Engine';
import { DEFAULT_ENGINE_SETTINGS } from './createEngine.constants';
import { TCreateEngineParams } from './createEngine.types';

export function createEngine({ app }: TCreateEngineParams): Engine {
  const args = ['serve', '--heartbeat', ENGINE_HEARTBEAT_SECONDS];
  if (process.env.WISPNOTE_NO_TAP) {
    args.push('--no-tap');
  }

  if (!fs.existsSync(ENGINE_BINARY)) {
    log('error', `${ENGINE_BINARY} is missing — run \`npm run engine:build\` first`);
  }

  const engine = new Engine({
    command: ENGINE_BINARY,
    args,
    cwd: ENGINE_DIR,
    env: process.env,
  });

  async function configure(): Promise<void> {
    try {
      const result = await engine.request<TConfigureResult>('configure', {
        settings: DEFAULT_ENGINE_SETTINGS,
      });
      if (VERBOSE) {
        result.triggers.forEach(({ trigger, action }) => {
          log('shortcut', `${trigger.padEnd(16)} → ${action}`);
        });
      }
    } catch (error) {
      log('error', `configure failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  engine.on('log', (line: string) => log('engine', line.replace(/^\[wispnote\]\s*/, '')));

  engine.on('status', (status: string) => {
    if (status === 'unhealthy' || status === 'failed') {
      log('engine', `status: ${status}`);
    }
  });

  engine.on('ready', (frame: TReadyFrame) => {
    log('engine', `ready · pid ${frame.pid} · engine ${frame.version} · runtime ${frame.runtime}`);

    if (!frame.accessibility) {
      log('engine', 'accessibility DENIED — every capture will come back empty');
    }
    if (!frame.tap && !process.env.WISPNOTE_NO_TAP) {
      log('engine', `event tap OFF — ${frame.tap_error}`);
    }
    if (!frame.pdf) {
      log('engine', 'PDF tools unavailable — PDF notes save without page or section');
    }

    // INFO: (serhat) sent on every ready, so a restart and a first launch are the same path.
    configure();
  });

  engine.on('incompatible', (frame: TReadyFrame) => {
    log(
      'error',
      `engine speaks protocol ${frame.protocol}, this build needs ${ENGINE_PROTOCOL_VERSION} — quitting`
    );
    app.quit();
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
}
