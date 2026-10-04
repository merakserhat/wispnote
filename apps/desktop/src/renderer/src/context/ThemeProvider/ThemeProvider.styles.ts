import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: light dark; }

  * { box-sizing: border-box; }

  html, body, #root {
    margin: 0;
    height: 100%;
    background: transparent;
    font-family: ${({ theme }) => theme.fonts.system};
    color: ${({ theme }) => theme.colors.textPrimary};
    -webkit-font-smoothing: antialiased;
    -webkit-user-select: none;
    overflow: hidden;
  }
`;
