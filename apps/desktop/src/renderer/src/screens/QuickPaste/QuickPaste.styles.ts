import styled, { css, keyframes } from 'styled-components';

import { StyledBox } from 'components/core/Box/Box.styles';

import { GROUP_ROW_HEIGHT, ROW_RADIUS } from './QuickPaste.constants';
import { TPastePanelStyleProps, TPasteRowStyleProps } from './QuickPaste.types';

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

export const Frame = styled(StyledBox)`
  pointer-events: none;
  user-select: none;
`;

export const Panel = styled(StyledBox)<TPastePanelStyleProps>`
  border-style: solid;
  overflow: hidden;
  box-shadow:
    0 14px 36px ${({ theme }) => theme.colors.shadowTint},
    0 2px 6px ${({ theme }) => theme.colors.shadowTint};
  transition: ${({ $transition }) => $transition};
  visibility: ${({ $visibility }) => $visibility};
  pointer-events: ${({ $pointerEvents }) => $pointerEvents};
`;

export const List = styled(StyledBox)`
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SkeletonBar = styled(StyledBox)`
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.backgroundSecondary} 0%,
    ${({ theme }) => theme.colors.backgroundSecondary} 35%,
    ${({ theme }) => theme.colors.backgroundTertiary} 50%,
    ${({ theme }) => theme.colors.backgroundSecondary} 65%,
    ${({ theme }) => theme.colors.backgroundSecondary} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1300ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const rowTone = css<TPasteRowStyleProps>`
  background: ${({ theme, $tone }) => {
    if ($tone === 'focused') {
      return theme.colors.backgroundSecondary;
    }
    if ($tone === 'parent') {
      return `color-mix(in srgb, ${theme.colors.backgroundSecondary} 55%, transparent)`;
    }
    return 'transparent';
  }};
`;

const rowReset = css`
  flex-shrink: 0;
  width: 100%;
  border: 0;
  border-radius: ${ROW_RADIUS}px;
  outline: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
`;

export const GroupRow = styled.button<TPasteRowStyleProps>`
  ${rowReset}
  ${rowTone}
  display: flex;
  align-items: center;
  gap: 10px;
  height: ${GROUP_ROW_HEIGHT}px;
  padding: 0 8px 0 10px;
`;

export const NoteRow = styled.button<TPasteRowStyleProps>`
  ${rowReset}
  ${rowTone}
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 7px 10px;
`;
