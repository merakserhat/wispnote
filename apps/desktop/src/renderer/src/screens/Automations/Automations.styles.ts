import styled, { css, keyframes } from 'styled-components';

import { StyledBox } from 'components/core/Box/Box.styles';

import { RULE_ARRIVAL_HIGHLIGHT_MS } from './Automations.constants';
import { TRuleRowRootStyleProps } from './Automations.types';

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const RuleRowRoot = styled(StyledBox)<TRuleRowRootStyleProps>`
  isolation: isolate;

  ${({ theme, $highlight }) =>
    $highlight &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset: 0 -${theme.space.sm}px;
        z-index: -1;
        border-radius: 10px;
        background: ${theme.colors.backgroundSecondary};
        animation: ${fadeOut} ${RULE_ARRIVAL_HIGHLIGHT_MS}ms ease-out forwards;
        pointer-events: none;
      }
    `}
`;

export const RuleToggle = styled.button`
  -webkit-app-region: no-drag;
  display: flex;
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    border-radius: 6px;
    outline: 2px solid ${({ theme }) => theme.colors.borderOutline};
    outline-offset: 4px;
  }
`;
