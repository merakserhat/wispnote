import { ReactNode } from 'react';

import { TIconComponent } from 'components/Icons';

import { TThemePrimitives } from 'theme/theme.types';

export type TInformationPageTone = 'neutral' | 'positive' | 'warning' | 'error';

export type TInformationPageToneProperty = {
  backgroundColor: keyof TThemePrimitives;
  iconColor: keyof TThemePrimitives;
};

export type TInformationPageToneMap = Record<TInformationPageTone, TInformationPageToneProperty>;

export type TInformationPageButton = {
  label: string;
  onPress: () => void;
};

export type TInformationPageProps = {
  title: string;
  description: ReactNode;
  icon?: TIconComponent;
  tone?: TInformationPageTone;
  primaryButton?: TInformationPageButton;
  secondaryButton?: TInformationPageButton;
};
