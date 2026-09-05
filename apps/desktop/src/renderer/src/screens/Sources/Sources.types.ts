import SourceKind from 'shared/enums/SourceKind';
import { TSource } from 'shared/types/source.types';

import { TThemePrimitives } from 'theme/theme.types';

export type TSourceKindProperty = {
  label: string;
  color: keyof TThemePrimitives;
};

export type TSourceKindMap = Record<SourceKind, TSourceKindProperty>;

export type TSelectSourceHandler = (source: TSource) => void;

export type TSourceKindGroupProps = {
  kind: SourceKind;
  onSelectSource: TSelectSourceHandler;
};

export type TSourceCardProps = {
  source: TSource;
  onPress: TSelectSourceHandler;
};

export type TSourceDetailProps = {
  source: TSource;
  onBack: () => void;
};

export type TKindDotStyleProps = {
  $color: keyof TThemePrimitives;
};
