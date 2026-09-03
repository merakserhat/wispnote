import styled from 'styled-components';

export const MainContainer = styled.div`
  height: 100%;
`;

export const LoadingContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;
