import styled from 'styled-components';

import { TSourceKindDotStyleProps } from './SourceKindDot.types';

export const Dot = styled.span<TSourceKindDotStyleProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme, $color }) => theme.colors[$color]};
`;
