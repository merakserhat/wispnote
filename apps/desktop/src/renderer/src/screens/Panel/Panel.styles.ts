import styled from 'styled-components';

import { darkColors } from 'theme/theme';

export const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  gap: 10px;
  outline: none;
`;
export const Header = styled.div`
  -webkit-app-region: drag;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const KindBadge = styled.span`
  ${({ theme }) => theme.textVariants.badge};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
  padding: 1px 5px;
  border: 1px solid currentColor;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  white-space: nowrap;
`;

export const Preview = styled.div<{ $empty: boolean }>`
  -webkit-app-region: no-drag;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  ${({ theme }) => theme.textVariants.body};
  -webkit-user-select: text;
  opacity: ${({ $empty }) => ($empty ? 0.45 : 1)};
  font-style: ${({ $empty }) => ($empty ? 'italic' : 'normal')};
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

export const NoteInput = styled.input`
  -webkit-app-region: no-drag;
  font: inherit;
  ${({ theme }) => theme.textVariants.body};
  width: 100%;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: inherit;
  -webkit-user-select: text;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -1px;
  }

  @media (prefers-color-scheme: dark) {
    background: ${darkColors.surfaceStrong};
  }
`;

export const Hint = styled.div`
  ${({ theme }) => theme.textVariants.meta};
  opacity: 0.55;
  text-align: center;
  margin-top: 6px;
`;
