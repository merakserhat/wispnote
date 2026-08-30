import { ConfigProvider, theme as antdTheme } from 'antd';

import { darkColors, theme } from 'theme';
import { TChildrenOnly } from 'types/common';

import { ANTD_CONTROL_HEIGHT, ANTD_FONT_SIZE } from './AntdProvider.constants';
import { useIsSystemDark } from './AntdProvider.hooks';

function AntdProvider({ children }: TChildrenOnly) {
  const isSystemDark = useIsSystemDark();
  const colors = isSystemDark ? { ...theme.colors, ...darkColors } : theme.colors;

  return (
    <ConfigProvider
      theme={{
        algorithm: isSystemDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: colors.accent,
          colorText: colors.text,
          colorTextSecondary: colors.textMuted,
          colorBorder: colors.border,
          colorBgContainer: colors.surface,
          colorBgElevated: colors.surfaceStrong,
          borderRadius: theme.radii.md,
          fontFamily: theme.fonts.system,
          fontSize: ANTD_FONT_SIZE,
          controlHeight: ANTD_CONTROL_HEIGHT,
          motion: false,
        },
      }}>
      {children}
    </ConfigProvider>
  );
}

export default AntdProvider;
