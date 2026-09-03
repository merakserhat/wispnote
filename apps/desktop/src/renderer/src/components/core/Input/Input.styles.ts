import styled from 'styled-components';
import { Input } from 'antd';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]}px;
  width: 100%;
`;

export const StyledInput = styled(Input)`
  && {
    -webkit-app-region: no-drag;
  }
`;

export const StyledPasswordInput = styled(Input.Password)`
  && {
    -webkit-app-region: no-drag;
  }
`;
