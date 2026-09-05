import styled from 'styled-components';

import { SWATCH_SIZE } from './Settings.constants';
import { TSwatchStyleProps } from './Settings.types';

export const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const SwatchStrip = styled.div`
  display: flex;
  height: ${SWATCH_SIZE}px;
  overflow: hidden;
  border-radius: 8px;
`;

export const Swatch = styled.span<TSwatchStyleProps>`
  flex: 1;
  background: ${({ $color }) => $color};
`;

export const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.m}px;
  padding: ${({ theme }) => theme.space.sm}px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.borderDivider};
`;
