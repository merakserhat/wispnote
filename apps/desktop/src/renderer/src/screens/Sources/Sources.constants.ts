import SourceKind from 'shared/enums/SourceKind';
import { TSourcesFilterParams } from 'shared/types/source.types';

import { TSourceKindMap } from './Sources.types';

export const SOURCE_KIND_ORDER: SourceKind[] = [
  SourceKind.WEB,
  SourceKind.PDF,
  SourceKind.MAIL,
  SourceKind.APP,
  SourceKind.FILE,
];

export const SOURCE_KIND_MAP: TSourceKindMap = {
  [SourceKind.WEB]: { label: 'Web' },
  [SourceKind.PDF]: { label: 'PDF' },
  [SourceKind.MAIL]: { label: 'Mail' },
  [SourceKind.APP]: { label: 'Apps' },
  [SourceKind.FILE]: { label: 'Files' },
};

export const SOURCE_GROUP_FIRST_PAGE = 0;
export const SOURCE_GROUP_PAGE_SIZE = 50;
export const SOURCE_GROUP_SORT: Pick<TSourcesFilterParams, 'sortBy' | 'isAscending'> = {
  sortBy: 'lastActivityAt',
  isAscending: false,
};

export const SOURCE_CARD_MIN_HEIGHT = 132;

export const SOURCES_PAGE_DESCRIPTION =
  'Every page, file, message and app document you have highlighted. Re-highlighting the same page lands on the same source.';
