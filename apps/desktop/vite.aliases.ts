import { resolve } from 'path';

export function sharedAlias(root: string) {
  return { shared: resolve(root, 'src/shared') };
}

export function rendererAlias(root: string) {
  const src = resolve(root, 'src/renderer/src');

  return {
    ...sharedAlias(root),
    api: resolve(src, 'api'),
    components: resolve(src, 'components'),
    configs: resolve(src, 'configs'),
    screens: resolve(src, 'screens'),
    hooks: resolve(src, 'hooks'),
    context: resolve(src, 'context'),
    helpers: resolve(src, 'helpers'),
    theme: resolve(src, 'theme'),
    types: resolve(src, 'types'),
  };
}
