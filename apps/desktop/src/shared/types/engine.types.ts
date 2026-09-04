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
  accessibility: boolean;
  tap: boolean;
  tap_error: string | null;
  pdf: boolean;
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
  TReadyFrame | THeartbeatFrame | TTriggerFrame | TResultFrame | TErrorFrame;

export type TEngineCommand =
  'ping' | 'capture' | 'configure' | 'pdf_info' | 'pdf_locate' | 'pdf_annotations' | 'shutdown';

export type TEngineSettings = {
  triggers: Record<string, TEngineAction>;
  suppress_fn: boolean;
  fn_double_interval: number;
  max_selection_chars: number;
  max_context_chars: number;
  deep_search_selection: boolean;
};

export type TCaptureResult = {
  context: TRawCaptureContext;
  can_sync: boolean;
};

export type TConfigureResult = {
  triggers: TTriggerBinding[];
};

export type TPdfTocEntry = {
  level: number;
  title: string;
  page: number;
};

export type TPdfInfoResult = {
  pdf_title?: string;
  pdf_author?: string;
  page_count?: number;
  toc?: TPdfTocEntry[];
  file_size?: number;
};

export type TPdfLocateResult = {
  located: boolean;
  total_pages?: number;
  page_number?: number;
  context_before?: string;
  context_after?: string;
  section?: string;
  error?: string;
};

export type TPdfAnnotation = {
  page_number: number;
  subtype: string;
  text: string;
  comment: string;
  author: string;
  modified: string;
  rect: number[];
  section: string;
  external_id: string;
};

export type TPdfAnnotationsResult = {
  annotations: TPdfAnnotation[];
};
