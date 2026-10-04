import styled from 'styled-components';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  && {
    -webkit-app-region: no-drag;
  }
`;

export const ButtonLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
