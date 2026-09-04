import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const SidebarContainer = styled.nav`
  display: flex;
  width: 208px;
  flex-direction: column;
  padding: ${({ theme }) => theme.space.xl}px ${({ theme }) => theme.space.sm}px
    ${({ theme }) => theme.space.sm}px;
  gap: ${({ theme }) => theme.space.xxs}px;
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
  padding: ${({ theme }) => theme.space.s}px ${({ theme }) => theme.space.sm}px;
  border: none;
  border-radius: 10px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.backgroundSecondaryActive : 'transparent'};
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

export const ContentContainer = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm}px;
  padding: ${({ theme }) => theme.space.xl}px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundTertiary};
  overflow-y: auto;
`;

export const ContentHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs}px;
  -webkit-app-region: drag;
`;
