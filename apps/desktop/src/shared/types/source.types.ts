import SourceKind from 'shared/enums/SourceKind';

import { TPaginationRequestParams } from './common';

export type TSource = {
  id: string;
  kind: SourceKind;
  title: string;
  url?: string;
  filePath?: string;
  appName?: string;
  bundleId?: string;
  externalId?: string;
  pageCount?: number;
  noteCount: number;
  lastActivityAt: string;
};

export type TSourcesFilterParams = {
  kind?: SourceKind;
  sortBy?: 'lastActivityAt' | 'title' | 'noteCount';
  isAscending?: boolean;
};

export type TSourceListRequestParams = TPaginationRequestParams<TSourcesFilterParams>;
