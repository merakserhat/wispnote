import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const SidebarContainer = styled.nav`
  display: flex;
  width: 208px;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[8]}px ${({ theme }) => theme.space[5]}px
    ${({ theme }) => theme.space[5]}px;
  gap: ${({ theme }) => theme.space[1]}px;
  -webkit-app-region: drag;
`;

export const SidebarFooter = styled.div`
  margin-top: auto;
  -webkit-app-region: no-drag;
`;

export const SidebarButton = styled.button<{ $isActive: boolean }>`
  -webkit-app-region: no-drag;
  display: flex;
  width: 100%;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]}px ${({ theme }) => theme.space[4]}px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: ${({ theme, $isActive }) => ($isActive ? theme.colors.surfaceMuted : 'transparent')};
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

export const ContentContainer = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]}px;
  padding: ${({ theme }) => theme.space[8]}px;
  border-top-left-radius: ${({ theme }) => theme.radii.xl}px;
  border-bottom-left-radius: ${({ theme }) => theme.radii.xl}px;
  background: ${({ theme }) => theme.colors.background};
  overflow-y: auto;
`;

export const ContentHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]}px;
  -webkit-app-region: drag;
`;
