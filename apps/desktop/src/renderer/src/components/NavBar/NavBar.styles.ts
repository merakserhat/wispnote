import styled from 'styled-components';

import { NAV_BAR_WIDTH } from './NavBar.constants';

export const StyledNavBar = styled.nav`
  display: flex;
  width: ${NAV_BAR_WIDTH}px;
  flex-shrink: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs}px;
  padding: ${({ theme }) => theme.space.xxxl + theme.space.m}px ${({ theme }) => theme.space.sm}px
    ${({ theme }) => theme.space.m}px;
  -webkit-app-region: drag;
`;

export const StyledNavBarItem = styled.button<{ $isActive: boolean; $paddingY: number }>`
  -webkit-app-region: no-drag;
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  padding: ${({ $paddingY }) => $paddingY}px ${({ theme }) => theme.space.sm}px;
  border: none;
  border-radius: 10px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.backgroundSecondaryActive : theme.colors.transparent};
  color: inherit;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.backgroundSecondaryActive : theme.colors.backgroundSecondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.borderOutline};
    outline-offset: -2px;
  }

  svg {
    flex-shrink: 0;
  }
`;
