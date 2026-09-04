import type { Preview } from '@storybook/react';
import { createGlobalStyle } from 'styled-components';

import Box from 'components/core/Box';

import AllContextProvider from 'context/AllContextProvider';
import { TColorScheme } from 'theme/theme.types';

const StorybookGlobalStyle = createGlobalStyle`
  html, body, #storybook-root {
    height: auto;
    overflow: visible;
    -webkit-user-select: text;
  }

  body {
    background: ${({ theme }) => theme.colors.backgroundTertiary};
  }
`;

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
  globalTypes: {
    colorScheme: {
      description: 'Light or dark theme primitives',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: 'light',
  },
  decorators: [
    function withProviders(Story, context) {
      const colorScheme = context.globals.colorScheme as TColorScheme;

      return (
        <AllContextProvider colorScheme={colorScheme}>
          <StorybookGlobalStyle />
          <Box p="m" alignItems="flex-start">
            <Story />
          </Box>
        </AllContextProvider>
      );
    },
  ],
};

export default preview;
