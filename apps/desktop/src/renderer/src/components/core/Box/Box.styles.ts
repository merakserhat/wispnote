import styled, { css } from 'styled-components';
import { border, compose, flexbox, layout, position, space } from 'styled-system';

import { BOX_STYLE_PROP_NAMES } from './Box.constants';
import { TBoxStyleProps } from './Box.types';

export const StyledBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !BOX_STYLE_PROP_NAMES.has(prop),
})<TBoxStyleProps>`
  display: flex;
  flex-direction: column;
  min-width: 0;

  ${compose(space, layout, flexbox, position, border)}

  ${({ theme, backgroundColor }) =>
    backgroundColor &&
    css`
      background-color: ${theme.colors[backgroundColor]};
    `}

  ${({ theme, borderColor }) =>
    borderColor &&
    css`
      border-color: ${theme.colors[borderColor]};
    `}

  ${({ borderRadius }) =>
    borderRadius !== undefined &&
    css`
      border-radius: ${borderRadius}px;
    `}

  ${({ theme, gap }) =>
    gap &&
    css`
      gap: ${theme.space[gap]}px;
    `}

  ${({ cursor }) =>
    cursor &&
    css`
      cursor: ${cursor};
    `}
`;
