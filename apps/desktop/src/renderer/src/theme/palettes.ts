import palettesJson from './palettes.json';
import { TPaletteDefinition, TThemePrimitives } from './theme.types';

export const palettes: TPaletteDefinition[] = palettesJson;

export const DEFAULT_PALETTE = palettes[0];

export function getPaletteById(paletteId: string): TPaletteDefinition {
  return palettes.find((palette) => palette.id === paletteId) ?? DEFAULT_PALETTE;
}

export function getThemePrimitives(paletteId: string, isDark: boolean): TThemePrimitives {
  const palette = getPaletteById(paletteId);

  return isDark ? palette.dark : palette.light;
}
