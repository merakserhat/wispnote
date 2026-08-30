import 'styled-components';

import { TTheme } from './theme.types';

declare module 'styled-components' {
  export interface DefaultTheme extends TTheme {}
}
