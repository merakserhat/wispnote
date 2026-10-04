import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { EventEmitter } from 'events';
import readline from 'readline';

import { ENGINE_PROTOCOL_VERSION } from 'shared/constants/engineProtocol';
import {
  TEngineCommand,
  TEngineFrame,
  TEngineStatus,
  TReadyFrame,
} from 'shared/types/engine.types';

import {
  BACKOFF,
  HEALTHY_UPTIME_MS,
  MAX_FAILURES,
  MISSED_BEATS,
  REQUEST_TIMEOUT_MS,
  SHUTDOWN_TIMEOUT_MS,
  STARTUP_GRACE_MS,
} from './Engine.constants';
import { TEngineOptions, TOutboundMessage, TPendingRequest, TRequestPayload } from './Engine.types';

export class Engine extends EventEmitter {
  private readonly options: TEngineOptions;

  private child: ChildProcessWithoutNullStreams | null = null;

  ready: TReadyFrame | null = null;

  status: TEngineStatus = 'stopped';

  failures = 0;

  private stopping = false;

  private startedAt = 0;

  private lastBeatAt = 0;

  private beatInterval = 2000;

  private readonly pending = new Map<number, TPendingRequest>();

  private nextId = 1;

  private watchdog: NodeJS.Timeout | null = null;

  private restartTimer: NodeJS.Timeout | null = null;

  constructor(options: TEngineOptions) {
    super();
    this.options = options;
  }

  start(): void {
    if (this.child || this.stopping) {
      return;
    }

    this.setStatus('starting');
    this.startedAt = Date.now();
    this.lastBeatAt = Date.now();

    const { command, args, cwd, env } = this.options;
    this.child = spawn(command, args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'] });

    this.child.on('error', (error: Error) => {
      this.log(`spawn failed: ${error.message}`);
      this.onExit(null, null);
    });

    readline.createInterface({ input: this.child.stdout }).on('line', (line) => this.onFrame(line));
    readline
      .createInterface({ input: this.child.stderr })
      .on('line', (line) => this.emit('log', line));

    this.child.on('exit', (code, signal) => this.onExit(code, signal));

    this.watchdog = setInterval(() => this.checkHealth(), 1000);
  }

  async stop(): Promise<void> {
    this.stopping = true;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
    if (this.watchdog) {
      clearInterval(this.watchdog);
    }
    if (!this.child) {
      return;
    }

    const { child } = this;
    this.send({ cmd: 'shutdown' });

    await new Promise<void>((resolve) => {
      // INFO: (serhat) SIGKILL, not SIGTERM - a wedged run loop ignores SIGTERM and an orphan keeps the Fn tap.
      const timer = setTimeout(() => {
        try {
          child.kill('SIGKILL');
        } catch {
          // ignore
        }
        resolve();
      }, SHUTDOWN_TIMEOUT_MS);

      child.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  private onFrame(line: string): void {
    if (!line.trim()) {
      return;
    }

    let frame: TEngineFrame;
    try {
      frame = JSON.parse(line) as TEngineFrame;
    } catch {
      this.emit('log', `unparseable frame: ${line}`);
      return;
    }

    if (frame.type === 'ready') {
      if (frame.protocol !== ENGINE_PROTOCOL_VERSION) {
        this.stopping = true;
        this.emit('incompatible', frame);
        this.kill();
        return;
      }
      this.ready = frame;
      this.beatInterval = (frame.heartbeat || 2) * 1000;
      this.lastBeatAt = Date.now();
      this.setStatus('running');
      this.emit('ready', frame);
      return;
    }

    if (frame.type === 'heartbeat') {
      this.lastBeatAt = Date.now();
      // INFO: (serhat) a live process with a dead tap looks fine and does nothing, so it is restarted.
      if (this.ready?.tap && !frame.tap) {
        this.log('event tap died - restarting');
        this.setStatus('unhealthy');
        this.kill();
        return;
      }
      if (this.status !== 'running') {
        this.setStatus('running');
      }
      this.emit('heartbeat', frame);
      return;
    }

    if (frame.type === 'result') {
      const waiting = this.pending.get(frame.id);
      if (!waiting) {
        return;
      }
      this.pending.delete(frame.id);
      if (frame.ok) {
        waiting.resolve(frame.data);
      } else {
        waiting.reject(new Error(frame.error ?? 'engine reported failure'));
      }
      return;
    }

    this.emit(frame.type, frame);
  }

  private send(message: TOutboundMessage): boolean {
    if (!this.child || this.child.killed) {
      return false;
    }
    try {
      this.child.stdin.write(`${JSON.stringify(message)}\n`);
      return true;
    } catch {
      return false;
    }
  }

  request<TResult = unknown>(
    cmd: TEngineCommand,
    payload: TRequestPayload = {},
    timeout = REQUEST_TIMEOUT_MS
  ): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const id = this.nextId;
      this.nextId += 1;

      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`engine timed out on ${cmd}`));
      }, timeout);

      this.pending.set(id, {
        resolve: (data) => {
          clearTimeout(timer);
          resolve(data as TResult);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });

      if (!this.send({ id, cmd, ...payload })) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(new Error('engine is not running'));
      }
    });
  }

  private checkHealth(): void {
    if (!this.child || this.stopping) {
      return;
    }

    const silence = Date.now() - this.lastBeatAt;

    if (!this.ready && silence < STARTUP_GRACE_MS) {
      return;
    }

    if (silence > this.beatInterval * MISSED_BEATS) {
      this.log(`no heartbeat for ${Math.round(silence / 1000)}s - restarting`);
      this.setStatus('unhealthy');
      this.kill();
    }
  }

  kill(): void {
    if (!this.child) {
      return;
    }
    try {
      this.child.kill('SIGKILL');
    } catch {
      // ignore
    }
  }

  private onExit(code: number | null, signal: NodeJS.Signals | null): void {
    if (this.watchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
    }

    const lived = Date.now() - this.startedAt;
    this.child = null;
    this.ready = null;

    this.pending.forEach((waiting) => waiting.reject(new Error('engine exited')));
    this.pending.clear();

    if (this.stopping) {
      this.setStatus('stopped');
      return;
    }

    // INFO: (serhat) a long run was not a crash loop whatever the exit code - reset so a blip never exhausts retries.
    if (lived > HEALTHY_UPTIME_MS) {
      this.failures = 0;
    }
    this.failures += 1;

    this.log(`exited (code=${code} signal=${signal}) after ${Math.round(lived / 1000)}s`);

    if (this.failures >= MAX_FAILURES) {
      this.setStatus('failed');
      this.emit('gave-up', this.failures);
      return;
    }

    const delay = BACKOFF[Math.min(this.failures - 1, BACKOFF.length - 1)];
    this.log(`restarting in ${delay}ms (attempt ${this.failures})`);
    this.restartTimer = setTimeout(() => this.start(), delay);
  }

  private setStatus(status: TEngineStatus): void {
    if (this.status === status) {
      return;
    }
    this.status = status;
    this.emit('status', status);
  }

  private log(message: string): void {
    this.emit('log', `[supervisor] ${message}`);
  }
}
