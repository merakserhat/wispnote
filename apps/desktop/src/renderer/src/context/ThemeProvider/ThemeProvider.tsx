import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import useIsDark from 'hooks/useIsDark';
import { darkThemePrimitives, lightThemePrimitives, theme } from 'theme';

import { GlobalStyle } from './ThemeProvider.styles';
import { TThemeProviderProps } from './ThemeProvider.types';

function ThemeProvider({ children, colorScheme = 'system' }: TThemeProviderProps) {
  const isDark = useIsDark({ colorScheme });
  const colors = isDark ? darkThemePrimitives : lightThemePrimitives;

  return (
    <StyledComponentProvider theme={{ ...theme, colors }}>
      <>
        <GlobalStyle />
        {children}
      </>
    </StyledComponentProvider>
  );
}

export default ThemeProvider;
