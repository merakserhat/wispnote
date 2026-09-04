import EnrichmentStatus from 'shared/enums/EnrichmentStatus';
import NoteKind from 'shared/enums/NoteKind';
import SourceKind from 'shared/enums/SourceKind';

export type TNoteSource = {
  kind: SourceKind;
  title?: string;
  url?: string;
  filePath?: string;
  appName?: string;
  bundleId?: string;
  documentId?: string;
  pageCount?: number;
  metadata?: Record<string, unknown>;
};

export type TNote = {
  id: string;
  sourceId: string;
  kind: NoteKind;
  selectedText: string;
  userNote: string;
  contextBefore: string;
  contextAfter: string;
  section?: string;
  pageNumber?: number;
  location?: Record<string, unknown>;
  windowTitle?: string;
  enrichmentStatus: EnrichmentStatus;
  createdAt: string;
};

export type TCreateNoteRequestParams = {
  source: TNoteSource;
  kind: NoteKind;
  selectedText?: string;
  userNote?: string;
  contextBefore?: string;
  contextAfter?: string;
  section?: string;
  pageNumber?: number;
  location?: Record<string, unknown>;
  windowTitle?: string;
  rawCapture?: Record<string, unknown>;
};

export type TNotesFilterParams = {
  sortBy?: 'createdAt' | 'updatedAt' | 'pageNumber';
  isAscending?: boolean;
  sourceId?: string;
  kind?: NoteKind;
  search?: string;
};

export type TNoteDetailRequestParams = {
  noteId: string;
};
