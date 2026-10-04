import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import { useAppearance } from 'context/AppearanceProvider';
import { theme } from 'theme';

import { GlobalStyle } from './ThemeProvider.styles';
import { TThemeProviderProps } from './ThemeProvider.types';

function ThemeProvider({ children }: TThemeProviderProps) {
  const { colors } = useAppearance();

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
