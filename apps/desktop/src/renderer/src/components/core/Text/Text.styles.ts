import styled, { css } from 'styled-components';
import { Typography } from 'antd';

import { darkColors } from 'theme/theme';

import { TTextStyleProps } from './Text.types';

export const StyledText = styled(Typography.Text)<TTextStyleProps>`
  && {
    ${({ theme, $variant = 'body' }) => css(theme.textVariants[$variant])}
    color: ${({ theme, $color = 'text' }) => theme.colors[$color]};

    ${({ $muted }) =>
      $muted &&
      css`
        opacity: 0.6;
      `}

    ${({ $truncate }) =>
      $truncate &&
      css`
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}

    @media (prefers-color-scheme: dark) {
      color: ${({ $color = 'text' }) =>
        $color === 'text' || $color === 'textMuted' ? darkColors[$color] : undefined};
    }
  }
`;
