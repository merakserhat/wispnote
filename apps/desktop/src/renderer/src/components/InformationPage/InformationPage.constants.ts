import { TInformationPageToneMap } from './InformationPage.types';

export const INFORMATION_PAGE_WIDTH = 340;
export const INFORMATION_PAGE_DISC_SIZE = 56;
export const INFORMATION_PAGE_ICON_SIZE = 26;

export const INFORMATION_PAGE_TONE_MAP: TInformationPageToneMap = {
  neutral: { backgroundColor: 'backgroundSecondary', iconColor: 'textSecondary' },
  positive: { backgroundColor: 'statusPositiveGhost', iconColor: 'statusPositivePrimary' },
  warning: { backgroundColor: 'statusWarningGhost', iconColor: 'statusWarningPrimary' },
  error: { backgroundColor: 'statusErrorGhost', iconColor: 'statusErrorPrimary' },
};
