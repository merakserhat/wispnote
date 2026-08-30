import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import { theme } from 'theme';
import { TChildrenOnly } from 'types/common';

import { GlobalStyle } from './ThemeProvider.styles';

function ThemeProvider({ children }: TChildrenOnly) {
  return (
    <StyledComponentProvider theme={theme}>
      <>
        <GlobalStyle />
        {children}
      </>
    </StyledComponentProvider>
  );
}

export default ThemeProvider;
