import styled, { css } from 'styled-components';
import { compose, space, textAlign } from 'styled-system';

import { TEXT_STYLE_PROP_NAMES } from './Text.constants';
import { TTextStyleProps } from './Text.types';

export const StyledText = styled.p.withConfig({
  shouldForwardProp: (prop) => !TEXT_STYLE_PROP_NAMES.has(prop),
})<TTextStyleProps>`
  margin: 0;
  font-family: inherit;
  overflow-wrap: anywhere;
  ${({ theme, $variant }) => css(theme.textVariants[$variant])}
  color: ${({ theme, $color }) => theme.colors[$color]};

  ${({ $numberOfLines }) =>
    $numberOfLines &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${$numberOfLines};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}

  ${compose(space, textAlign)}
`;
