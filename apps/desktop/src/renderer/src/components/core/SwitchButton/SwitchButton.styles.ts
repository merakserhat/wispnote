import styled from 'styled-components';
import { Switch } from 'antd';

export const SwitchButtonLabel = styled.label<{ $disabled: boolean }>`
  -webkit-app-region: no-drag;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
`;

export const SwitchButtonText = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs}px;
`;

export const StyledSwitch = styled(Switch)`
  && {
    flex-shrink: 0;
  }
`;
