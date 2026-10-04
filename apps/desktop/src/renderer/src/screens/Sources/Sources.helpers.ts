import SourceKind from 'shared/enums/SourceKind';
import { TSource } from 'shared/types/source.types';

import { SOURCE_KIND_MAP } from './Sources.constants';

export function getLabelBySourceKind(kind: SourceKind) {
  return SOURCE_KIND_MAP[kind].label;
}

export function formatSourceOrigin({ url, filePath, appName }: TSource): string {
  if (url) {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  }

  if (filePath) {
    return filePath.split('/').pop() ?? filePath;
  }

  return appName ?? '';
}

export function formatSourceMeta({ noteCount, pageCount }: TSource): string {
  const notes = `${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`;

  return pageCount ? `${notes} · ${pageCount} pages` : notes;
}

export function formatSourceLocation({ url, filePath, appName }: TSource): string {
  return url ?? filePath ?? appName ?? '';
}
