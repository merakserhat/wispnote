import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import useIsSystemDark from 'hooks/useIsSystemDark';
import { darkColors, theme } from 'theme';
import { TChildrenOnly } from 'types/common';

import { GlobalStyle } from './ThemeProvider.styles';

function ThemeProvider({ children }: TChildrenOnly) {
  const isSystemDark = useIsSystemDark();
  const colors = isSystemDark ? { ...theme.colors, ...darkColors } : theme.colors;

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
