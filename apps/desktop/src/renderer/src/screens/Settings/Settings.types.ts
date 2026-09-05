import { ReactNode } from 'react';

import { TPaletteDefinition } from 'theme/theme.types';

export type TPaletteCardProps = {
  palette: TPaletteDefinition;
  isSelected: boolean;
  onSelect: (paletteId: string) => void;
};

export type TSettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export type TSwatchStyleProps = {
  $color: string;
};
