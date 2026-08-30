import { TRawCaptureContext } from './capture.types';

export type TEngineAction =
  'none' | 'show_panel' | 'quick_highlight' | 'quick_note' | 'sync_source' | 'open_notes';

export type TEngineStatus = 'stopped' | 'starting' | 'running' | 'unhealthy' | 'failed';

export type TTriggerBinding = {
  trigger: string;
  action: TEngineAction;
};

export type TReadyFrame = {
  type: 'ready';
  protocol: number;
  version: string;
  pid: number;
  python: string;
  data_dir: string;
  accessibility: boolean;
  tap: boolean;
  tap_error?: string;
  heartbeat: number;
  triggers: TTriggerBinding[];
};

export type THeartbeatFrame = {
  type: 'heartbeat';
  seq: number;
  uptime: number;
  tap: boolean;
};

export type TTriggerFrame = {
  type: 'trigger';
  trigger: string;
  action: TEngineAction;
  context: TRawCaptureContext;
  can_sync: boolean;
  summary: string;
};

export type TToastFrame = {
  type: 'toast';
  message: string;
  detail: string;
  note_id?: number;
};

export type TDataFrame = {
  type: 'data';
  event: string;
  note_id: number | null;
};

export type TResultFrame = {
  type: 'result';
  id: number;
  ok: boolean;
  data: unknown;
  error: string | null;
};

export type TErrorFrame = {
  type: 'error';
  message: string;
  trigger?: string;
};

export type TEngineFrame =
  | TReadyFrame
  | THeartbeatFrame
  | TTriggerFrame
  | TToastFrame
  | TDataFrame
  | TResultFrame
  | TErrorFrame;

export type TEngineCommand =
  | 'ping'
  | 'capture'
  | 'save_highlight'
  | 'save_note'
  | 'sync_source'
  | 'list_notes'
  | 'list_sources'
  | 'stats'
  | 'settings'
  | 'shutdown';

export type TCaptureResult = {
  context: TRawCaptureContext;
  can_sync: boolean;
};

export type TSaveResult = {
  saved: boolean;
  created?: boolean;
  note_id?: number;
  summary?: string;
  detail?: string;
  enrichment_queued?: boolean;
  reason?: string;
};
