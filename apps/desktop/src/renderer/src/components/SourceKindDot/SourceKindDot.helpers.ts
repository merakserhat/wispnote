import SourceKind from 'shared/enums/SourceKind';

import { SOURCE_KIND_COLOR_MAP } from './SourceKindDot.constants';

export function getColorBySourceKind(kind: SourceKind) {
  return SOURCE_KIND_COLOR_MAP[kind];
}
