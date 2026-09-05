import SourceKind from 'shared/enums/SourceKind';
import { TSource } from 'shared/types/source.types';

export type TSourceKindProperty = {
  label: string;
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
