import { ConfigProvider } from 'antd';

import { useAppearance } from 'context/AppearanceProvider';

import { buildAntdTheme } from './AntdProvider.helpers';
import { TAntdProviderProps } from './AntdProvider.types';

function AntdProvider({ children }: TAntdProviderProps) {
  const { colors, isDark } = useAppearance();

  return <ConfigProvider theme={buildAntdTheme({ colors, isDark })}>{children}</ConfigProvider>;
}

export default AntdProvider;
