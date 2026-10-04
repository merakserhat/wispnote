import { FC } from 'react';

import { TThemePrimitives } from 'theme/theme.types';

export type TIconProps = {
  width?: number | string;
  height?: number | string;
  iconColor?: keyof TThemePrimitives;
  strokeWidth?: number;
};

export type TIconComponent = FC<TIconProps>;
