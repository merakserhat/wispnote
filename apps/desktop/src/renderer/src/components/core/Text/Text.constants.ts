import { space, textAlign } from 'styled-system';

export const TEXT_STYLE_PROP_NAMES = new Set<string>(
  [space, textAlign].flatMap((styleFn) => styleFn.propNames ?? [])
);
