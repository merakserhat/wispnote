import styled, { css } from 'styled-components';

import { StyledBox } from 'components/core/Box/Box.styles';

import { CARD_ELEVATION_SHADOW } from './Card.constants';
import { TStyledCardProps } from './Card.types';

export const StyledCard = styled(StyledBox)<TStyledCardProps>`
  border-style: solid;
  border-width: 0;

  ${({ theme, $elevated }) =>
    $elevated &&
    css`
      box-shadow:
        ${CARD_ELEVATION_SHADOW},
        0 0 0 1px ${theme.colors.borderDivider};
    `}
`;
