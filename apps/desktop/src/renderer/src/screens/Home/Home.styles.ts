import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const ContentContainer = styled.main`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm}px;
  margin: ${({ theme }) => theme.space.sm}px ${({ theme }) => theme.space.sm}px
    ${({ theme }) => theme.space.sm}px 0;
  padding: ${({ theme }) => theme.space.xl}px;
  border: 1px solid ${({ theme }) => theme.colors.borderDivider};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundTertiary};
  overflow-y: auto;
`;

export const ContentHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs}px;
  -webkit-app-region: drag;
`;
