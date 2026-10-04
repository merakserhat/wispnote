import styled from 'styled-components';
import { Button } from 'antd';

export const IconButtonRoot = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const StyledIconButton = styled(Button)`
  && {
    -webkit-app-region: no-drag;
    flex-shrink: 0;
  }
`;
