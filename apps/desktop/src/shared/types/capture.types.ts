export type TSourceKind = 'web' | 'pdf' | 'file' | 'mail' | 'app';

export type TCaptureContext = {
  timestamp: string;

  appName: string;
  bundleId: string;
  pid: number;

  windowTitle: string;
  elementRole: string;
  elementSubrole: string;

  selectedText: string;
  selectionTruncated: boolean;

  contextBefore: string;
  contextAfter: string;

  sourceKind: TSourceKind;
  sourceKey: string;
  sourceTitle: string;
  url?: string;
  filePath?: string;

  pageNumber?: number;
  lineNumber?: number;
  section?: string;

  extras: Record<string, unknown>;
  errors: string[];
};

export type TRawCaptureContext = {
  timestamp: string;
  app_name: string;
  bundle_id: string;
  pid: number;
  window_title: string;
  element_role: string;
  element_subrole: string;
  selected_text: string;
  selection_truncated: boolean;
  context_before: string;
  context_after: string;
  source_kind: TSourceKind;
  source_key: string;
  source_title: string;
  url?: string;
  file_path?: string;
  page_number?: number;
  line_number?: number;
  section?: string;
  extras: Record<string, unknown>;
  errors: string[];
};
