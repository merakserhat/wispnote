import { createGlobalStyle } from 'styled-components';

import { darkColors } from 'theme/theme';

export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: light dark; }

  * { box-sizing: border-box; }

  html, body, #root {
    margin: 0;
    height: 100%;
    background: transparent;
    font-family: ${({ theme }) => theme.fonts.system};
    color: ${({ theme }) => theme.colors.text};
    -webkit-user-select: none;
    overflow: hidden;
  }

  @media (prefers-color-scheme: dark) {
    html, body, #root { color: ${darkColors.text}; }
  }
`;
