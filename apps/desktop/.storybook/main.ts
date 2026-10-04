import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';
import { mergeConfig } from 'vite';

import { rendererAlias } from '../vite.aliases';

const config: StorybookConfig = {
  stories: ['../src/renderer/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: { alias: rendererAlias(resolve(__dirname, '..')) },
    });
  },
};

export default config;
