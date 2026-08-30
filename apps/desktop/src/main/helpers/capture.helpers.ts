import { TCaptureContext, TRawCaptureContext } from 'shared/types/capture.types';

/**
 * snake_case on the wire, camelCase in the app.
 *
 * Done once, here, rather than letting Python's field names leak into every
 * component - and it is the single place to change when `models.py` changes.
 */
export const toCaptureContext = (raw: TRawCaptureContext): TCaptureContext => ({
  timestamp: raw.timestamp,
  appName: raw.app_name,
  bundleId: raw.bundle_id,
  pid: raw.pid,
  windowTitle: raw.window_title,
  elementRole: raw.element_role,
  elementSubrole: raw.element_subrole,
  selectedText: raw.selected_text,
  selectionTruncated: raw.selection_truncated,
  contextBefore: raw.context_before,
  contextAfter: raw.context_after,
  sourceKind: raw.source_kind,
  sourceKey: raw.source_key,
  sourceTitle: raw.source_title,
  url: raw.url,
  filePath: raw.file_path,
  pageNumber: raw.page_number,
  lineNumber: raw.line_number,
  section: raw.section,
  extras: raw.extras ?? {},
  errors: raw.errors ?? [],
});

/** "p. 39 · line 12 · Chapter 3" - whatever of it exists. */
export const formatLocation = (context: TCaptureContext): string =>
  [
    context.pageNumber ? `p. ${context.pageNumber}` : '',
    context.lineNumber ? `line ${context.lineNumber}` : '',
    context.section ?? '',
  ]
    .filter(Boolean)
    .join(' · ');

/** The document a capture came from, however little we know about it. */
export const formatSource = (context: TCaptureContext): string =>
  context.sourceTitle || context.appName || 'Unknown source';

/** One line for the log: what the user was looking at. */
export const describeCapture = (context: TCaptureContext): string =>
  [`${context.sourceKind} · ${formatSource(context)}`, formatLocation(context)]
    .filter(Boolean)
    .join('  ');

export const previewSelection = (context: TCaptureContext, limit = 90): string => {
  const selection = (context.selectedText || '').replace(/\s+/g, ' ').trim();
  if (!selection) {
    return '(no selection)';
  }
  return selection.length > limit ? `"${selection.slice(0, limit)}…"` : `"${selection}"`;
};
