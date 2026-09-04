import styled from 'styled-components';

export const SignInContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.backgroundPrimary};
`;

export const SignInCard = styled.form`
  display: flex;
  width: 340px;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.m}px;
`;

export const SignInHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs}px;
  margin-bottom: ${({ theme }) => theme.space.xs}px;
`;
