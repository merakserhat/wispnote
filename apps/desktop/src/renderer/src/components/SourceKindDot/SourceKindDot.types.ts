import SourceKind from 'shared/enums/SourceKind';

import { TThemePrimitives } from 'theme/theme.types';

export type TSourceKindDotProps = {
  kind: SourceKind;
  size?: number;
};

export type TSourceKindDotStyleProps = {
  $color: keyof TThemePrimitives;
  $size: number;
};
