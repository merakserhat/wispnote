import styled, { css } from 'styled-components';

import { StyledBox } from 'components/core/Box/Box.styles';

import { CARD_ELEVATION_SHADOW, CARD_HOVER_SHADOW, CARD_TRANSITION } from './Card.constants';
import { TStyledCardProps } from './Card.types';

export const StyledCard = styled(StyledBox)<TStyledCardProps>`
  border-style: solid;

  ${({ theme, $elevated }) =>
    $elevated &&
    css`
      box-shadow:
        ${CARD_ELEVATION_SHADOW},
        0 0 0 1px ${theme.colors.borderDivider};
    `}

  ${({ theme, $interactive, $elevated }) =>
    $interactive &&
    css`
      -webkit-app-region: no-drag;
      cursor: pointer;
      font: inherit;
      color: inherit;
      text-align: left;
      transition:
        background-color ${CARD_TRANSITION},
        border-color ${CARD_TRANSITION},
        box-shadow ${CARD_TRANSITION},
        transform ${CARD_TRANSITION};

      &:hover {
        background-color: ${theme.colors.backgroundElevatedHover};
        border-color: ${theme.colors.borderOutline};
        transform: translateY(-1px);

        ${
          $elevated &&
          css`
            box-shadow:
              ${CARD_HOVER_SHADOW},
              0 0 0 1px ${theme.colors.borderOutline};
          `
        }
      }

      &:active {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.borderOutline};
        outline-offset: 2px;
      }
    `}
`;
