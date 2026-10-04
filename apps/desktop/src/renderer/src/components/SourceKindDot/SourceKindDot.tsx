import { SOURCE_KIND_DOT_SIZE } from './SourceKindDot.constants';
import { getColorBySourceKind } from './SourceKindDot.helpers';
import { Dot } from './SourceKindDot.styles';
import { TSourceKindDotProps } from './SourceKindDot.types';

function SourceKindDot({ kind, size = SOURCE_KIND_DOT_SIZE }: TSourceKindDotProps) {
  return <Dot $color={getColorBySourceKind(kind)} $size={size} />;
}

export default SourceKindDot;
