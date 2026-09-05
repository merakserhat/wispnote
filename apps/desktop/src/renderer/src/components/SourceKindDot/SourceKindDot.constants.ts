import SourceKind from 'shared/enums/SourceKind';

import { TThemePrimitives } from 'theme/theme.types';

export const SOURCE_KIND_COLOR_MAP: Record<SourceKind, keyof TThemePrimitives> = {
  [SourceKind.WEB]: 'sourceWeb',
  [SourceKind.PDF]: 'sourcePdf',
  [SourceKind.MAIL]: 'sourceMail',
  [SourceKind.APP]: 'sourceApp',
  [SourceKind.FILE]: 'sourceFile',
};

export const SOURCE_KIND_DOT_SIZE = 9;
