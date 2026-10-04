import styled from 'styled-components';

import { THighlightStyleProps } from './NotesFeed.types';

export const NoteToggle = styled.button`
  -webkit-app-region: no-drag;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs}px;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    border-radius: 6px;
    outline: 2px solid ${({ theme }) => theme.colors.borderOutline};
    outline-offset: 4px;
  }
`;

export const Highlight = styled.span<THighlightStyleProps>`
  padding: 0 3px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: color-mix(in srgb, ${({ theme, $color }) => theme.colors[$color]} 18%, transparent);
`;
