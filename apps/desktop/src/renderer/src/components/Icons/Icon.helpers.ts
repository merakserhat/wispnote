import { useTheme } from 'styled-components';

import { TIconProps } from './Icon.types';

export function useIconColor(iconColor: TIconProps['iconColor']): string {
  const { colors } = useTheme();

  return iconColor ? colors[iconColor] : 'currentColor';
}
