import styled from 'styled-components';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  && {
    -webkit-app-region: no-drag;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
