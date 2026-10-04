import NoteKind from 'shared/enums/NoteKind';
import SourceKind from 'shared/enums/SourceKind';
import { TCaptureContext } from 'shared/types/capture.types';
import { TToastPayload } from 'shared/types/ipc.types';
import { TCreateNoteRequestParams, TNoteSource } from 'shared/types/note.types';

import { formatLocation, formatSource } from '../helpers';
import { toErrorResponse } from '../ipc/ipc.helpers';

import { SOURCE_KIND_BY_CAPTURE } from './createActions.constants';
import { TToCreateNoteParamsParams, TToImportedNoteParamsParams } from './createActions.types';

export function hasContent(context: TCaptureContext, userNote: string): boolean {
  return Boolean(context.selectedText.trim() || userNote.trim());
}

export function describeSource(context: TCaptureContext): string {
  return [formatSource(context), formatLocation(context)].filter(Boolean).join(' · ');
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function toNoteSource(context: TCaptureContext): TNoteSource {
  const kind = SOURCE_KIND_BY_CAPTURE[context.sourceKind];
  const needsDocumentId = kind === SourceKind.MAIL || kind === SourceKind.APP;

  return {
    kind,
    title: context.sourceTitle || undefined,
    url: context.url || undefined,
    filePath: context.filePath || undefined,
    appName: context.appName || undefined,
    bundleId: context.bundleId || undefined,
    documentId: needsDocumentId ? context.sourceKey : undefined,
    pageCount: toPageCount(context),
  };
}

function toPageCount(context: TCaptureContext): number | undefined {
  const total = context.extras.total_pages;
  return typeof total === 'number' && total > 0 ? total : undefined;
}

function toLocation(context: TCaptureContext): Record<string, unknown> {
  const location: Record<string, unknown> = {};
  if (context.lineNumber) {
    location.lineNumber = context.lineNumber;
  }
  if (context.extras.page_hint_source) {
    location.pageHintSource = context.extras.page_hint_source;
  }
  if (context.elementRole) {
    location.elementRole = context.elementRole;
  }
  if (context.selectionTruncated) {
    location.selectionTruncated = true;
  }
  return location;
}

function toRawCapture(context: TCaptureContext): Record<string, unknown> {
  const { raw, ...extras } = context.extras;
  return {
    context: { ...context, extras },
    ax: raw ?? null,
    capturedAt: context.timestamp,
  };
}

export function toCreateNoteParams({
  context,
  userNote,
  located,
}: TToCreateNoteParamsParams): TCreateNoteRequestParams {
  const found = located?.located ? located : null;

  return {
    source: toNoteSource(context),
    kind: userNote ? NoteKind.NOTE : NoteKind.HIGHLIGHT,
    selectedText: context.selectedText,
    userNote,
    contextBefore: found?.context_before || context.contextBefore,
    contextAfter: found?.context_after || context.contextAfter,
    section: found?.section || context.section || undefined,
    pageNumber: found?.page_number ?? context.pageNumber,
    location: toLocation(context),
    windowTitle: context.windowTitle || undefined,
    rawCapture: toRawCapture(context),
  };
}

export function toImportedNoteParams({
  context,
  annotation,
}: TToImportedNoteParamsParams): TCreateNoteRequestParams {
  return {
    source: toNoteSource(context),
    kind: NoteKind.IMPORTED,
    selectedText: annotation.text,
    userNote: annotation.comment,
    section: annotation.section || undefined,
    pageNumber: annotation.page_number,
    location: {
      rect: annotation.rect,
      subtype: annotation.subtype,
      author: annotation.author,
      modified: annotation.modified,
      externalId: annotation.external_id,
    },
    windowTitle: context.sourceTitle || undefined,
  };
}

export function toSaveFailureToast(error: unknown): TToastPayload {
  const failure = toErrorResponse(error);

  if (failure.status === 401) {
    return { message: 'Sign in to save', detail: 'Open WispNote from the menu bar' };
  }
  if (failure.status === 0) {
    return { message: 'Could not reach the server', detail: 'The highlight was not saved' };
  }
  return { message: 'Could not save', detail: failure.errorMessage };
}
