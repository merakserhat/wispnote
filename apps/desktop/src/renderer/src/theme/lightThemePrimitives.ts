import palette from './palette';

const lightThemePrimitives = {
  textPrimary: '#352f2a',
  textSecondary: '#675c54',
  textTertiary: '#91867e',
  textInverted: '#352f2a',
  textLink: '#675c54',

  backgroundPrimary: palette.parchment,
  backgroundSecondary: '#e4e4df',
  backgroundSecondaryActive: '#d9d8d4',
  backgroundTertiary: '#f7f7f5',
  backgroundElevated: '#ffffff',
  backgroundElevatedHover: '#f3f2ef',

  borderDivider: '#dbdad6',
  borderOutline: '#c5c3bf',

  buttonPrimary: palette.almondSilk,
  buttonPrimaryHover: '#bba69a',
  buttonPrimaryOnTap: '#a69389',
  buttonGhost: '#eae6e1',

  statusPositivePrimary: '#3d7a5a',
  statusPositiveGhost: '#d1dbd2',
  statusWarningPrimary: '#b0782a',
  statusWarningGhost: '#e3daca',
  statusErrorPrimary: '#b3413a',
  statusErrorGhost: '#e4d1cd',

  sourceWeb: '#415a77',
  sourcePdf: '#c0603a',
  sourceMail: '#4d8a6a',
  sourceApp: '#6f5fa8',
  sourceFile: '#778da9',

  transparent: 'transparent',
} as const;

export default lightThemePrimitives;
