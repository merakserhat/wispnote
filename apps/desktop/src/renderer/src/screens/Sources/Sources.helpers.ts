import SourceKind from 'shared/enums/SourceKind';
import { TSource } from 'shared/types/source.types';

import { SOURCE_KIND_MAP } from './Sources.constants';

export function getLabelBySourceKind(kind: SourceKind) {
  return SOURCE_KIND_MAP[kind].label;
}

export function getSourceSender({ metadata }: TSource): string {
  const sender = metadata?.sender;

  return typeof sender === 'string' ? sender : '';
}

export function formatSourceOrigin(source: TSource): string {
  const { url, filePath, appName } = source;
  const sender = getSourceSender(source);

  if (sender) {
    return sender;
  }

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

export function formatSourceLocation(source: TSource): string {
  const { url, filePath, appName } = source;

  return url ?? filePath ?? (getSourceSender(source) || appName) ?? '';
}
