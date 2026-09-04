import { ConfigProvider } from 'antd';

import useIsDark from 'hooks/useIsDark';
import { darkThemePrimitives, lightThemePrimitives } from 'theme';

import { buildAntdTheme } from './AntdProvider.helpers';
import { TAntdProviderProps } from './AntdProvider.types';

function AntdProvider({ children, colorScheme = 'system' }: TAntdProviderProps) {
  const isDark = useIsDark({ colorScheme });
  const colors = isDark ? darkThemePrimitives : lightThemePrimitives;

  return <ConfigProvider theme={buildAntdTheme({ colors, isDark })}>{children}</ConfigProvider>;
}

export default AntdProvider;
