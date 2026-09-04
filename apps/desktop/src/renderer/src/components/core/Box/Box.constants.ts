import { border, flexbox, layout, position, space } from 'styled-system';

const STYLED_SYSTEM_PROP_NAMES = [space, layout, flexbox, position, border].flatMap(
  (styleFn) => styleFn.propNames ?? []
);

export const BOX_STYLE_PROP_NAMES = new Set<string>([
  ...STYLED_SYSTEM_PROP_NAMES,
  'backgroundColor',
  'borderColor',
  'borderRadius',
  'gap',
  'cursor',
]);
