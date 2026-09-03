import styled from 'styled-components';

export const SignInContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;

export const SignInCard = styled.form`
  display: flex;
  width: 320px;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]}px;
`;

export const SignInHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]}px;
  margin-bottom: ${({ theme }) => theme.space[3]}px;
`;
