import styled, { css } from 'styled-components';

export const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.space.sm}px;
  gap: ${({ theme }) => theme.space.s}px;
  outline: none;
`;

export const Header = styled.div`
  -webkit-app-region: drag;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const KindBadge = styled.span`
  ${({ theme }) => css(theme.textVariants.label)};
  color: ${({ theme }) => theme.colors.textTertiary};
  padding: 1px 5px;
  border: 1px solid currentColor;
  border-radius: 4px;
  white-space: nowrap;
`;

export const Preview = styled.div<{ $empty: boolean }>`
  -webkit-app-region: no-drag;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: ${({ theme }) => theme.space.s}px ${({ theme }) => theme.space.sm}px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  -webkit-user-select: text;
  opacity: ${({ $empty }) => ($empty ? 0.45 : 1)};
  font-style: ${({ $empty }) => ($empty ? 'italic' : 'normal')};
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const NoteInput = styled.input`
  -webkit-app-region: no-drag;
  font: inherit;
  ${({ theme }) => css(theme.textVariants.bodySub)};
  width: 100%;
  padding: ${({ theme }) => theme.space.s}px ${({ theme }) => theme.space.sm}px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  background: ${({ theme }) => theme.colors.backgroundTertiary};
  color: ${({ theme }) => theme.colors.textPrimary};
  -webkit-user-select: text;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.buttonPrimary};
    outline-offset: -1px;
  }
`;

export const Hint = styled.div`
  ${({ theme }) => css(theme.textVariants.caption)};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-align: center;
  margin-top: ${({ theme }) => theme.space.xs}px;
`;
