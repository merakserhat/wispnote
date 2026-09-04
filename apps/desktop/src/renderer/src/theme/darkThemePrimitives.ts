import palette from './palette';

import { TThemePrimitives } from './theme.types';

const darkThemePrimitives: TThemePrimitives = {
  textPrimary: palette.parchment,
  textSecondary: '#aaa9a6',
  textTertiary: '#7a7875',
  textInverted: '#1c1917',
  textLink: palette.parchment,

  backgroundPrimary: '#1c1917',
  backgroundSecondary: '#2b2826',
  backgroundSecondaryActive: '#373532',
  backgroundTertiary: '#3a3632',

  borderDivider: '#353230',
  borderOutline: '#4e4c49',

  buttonPrimary: palette.parchment,
  buttonPrimaryHover: '#d1d1cd',
  buttonPrimaryOnTap: '#b9b9b6',
  buttonGhost: '#423f3d',

  statusPositivePrimary: '#6fbf95',
  statusPositiveGhost: '#2b372e',
  statusWarningPrimary: '#e0a24a',
  statusWarningGhost: '#3f3220',
  statusErrorPrimary: '#ef7a70',
  statusErrorGhost: '#422a27',

  transparent: 'transparent',
};

export default darkThemePrimitives;
