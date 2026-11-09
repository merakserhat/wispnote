import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const ActivityIndicatorRoot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;
  animation: ${spin} 900ms linear infinite;
`;
