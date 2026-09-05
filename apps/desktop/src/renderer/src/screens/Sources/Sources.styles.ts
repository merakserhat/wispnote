import styled from 'styled-components';

import { TKindDotStyleProps } from './Sources.types';

export const SourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const GroupHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm}px;
  padding-top: ${({ theme }) => theme.space.s}px;

  &:first-child {
    padding-top: 0;
  }
`;

export const KindDot = styled.span<TKindDotStyleProps>`
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme, $color }) => theme.colors[$color]};
`;
