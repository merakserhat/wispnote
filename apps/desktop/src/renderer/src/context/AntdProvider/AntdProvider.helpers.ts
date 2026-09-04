import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';

import { theme } from 'theme';
import { TThemePrimitives } from 'theme/theme.types';

import {
  ANTD_BORDER_RADIUS,
  ANTD_BORDER_RADIUS_LG,
  ANTD_BORDER_RADIUS_SM,
  ANTD_CONTROL_HEIGHT,
  ANTD_CONTROL_HEIGHT_LG,
  ANTD_CONTROL_HEIGHT_SM,
  ANTD_FONT_SIZE,
  ANTD_FONT_SIZE_LG,
  ANTD_FONT_SIZE_SM,
  ANTD_SEGMENTED_TRACK_PADDING,
} from './AntdProvider.constants';
import { TBuildAntdThemeParams } from './AntdProvider.types';

function buildToken(colors: TThemePrimitives): ThemeConfig['token'] {
  return {
    colorPrimary: colors.buttonPrimary,
    colorPrimaryHover: colors.buttonPrimaryHover,
    colorPrimaryActive: colors.buttonPrimaryOnTap,
    colorSuccess: colors.statusPositivePrimary,
    colorWarning: colors.statusWarningPrimary,
    colorError: colors.statusErrorPrimary,
    green: colors.statusPositivePrimary,

    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextTertiary: colors.textTertiary,
    colorTextDisabled: colors.textTertiary,
    colorLink: colors.textLink,

    colorBorder: colors.borderOutline,
    colorBorderSecondary: colors.borderDivider,
    colorSplit: colors.borderDivider,

    colorBgContainer: colors.backgroundTertiary,
    colorBgElevated: colors.backgroundTertiary,
    colorBgLayout: colors.backgroundPrimary,
    colorBgContainerDisabled: colors.backgroundSecondary,
    colorFillTertiary: colors.buttonGhost,
    colorFillSecondary: colors.backgroundSecondaryActive,
    colorFill: colors.borderOutline,
    colorBgTextHover: colors.backgroundSecondary,
    colorBgTextActive: colors.backgroundSecondaryActive,

    controlHeightSM: ANTD_CONTROL_HEIGHT_SM,
    controlHeight: ANTD_CONTROL_HEIGHT,
    controlHeightLG: ANTD_CONTROL_HEIGHT_LG,
    borderRadiusSM: ANTD_BORDER_RADIUS_SM,
    borderRadius: ANTD_BORDER_RADIUS,
    borderRadiusLG: ANTD_BORDER_RADIUS_LG,
    fontFamily: theme.fonts.system,
    fontSizeSM: ANTD_FONT_SIZE_SM,
    fontSize: ANTD_FONT_SIZE,
    fontSizeLG: ANTD_FONT_SIZE_LG,
    motion: false,
  };
}

function buildComponents(colors: TThemePrimitives): ThemeConfig['components'] {
  return {
    Button: {
      fontWeight: 600,
      primaryColor: colors.textInverted,
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
      defaultBg: colors.transparent,
      defaultColor: colors.textPrimary,
      defaultBorderColor: colors.borderOutline,
      defaultHoverBg: colors.backgroundSecondary,
      defaultHoverColor: colors.textPrimary,
      defaultHoverBorderColor: colors.textTertiary,
      defaultActiveBg: colors.backgroundSecondaryActive,
      defaultActiveColor: colors.textPrimary,
      defaultActiveBorderColor: colors.textTertiary,
      textTextColor: colors.textSecondary,
      textTextHoverColor: colors.textPrimary,
      textTextActiveColor: colors.textPrimary,
      textHoverBg: colors.backgroundSecondary,
      borderColorDisabled: colors.borderDivider,
      paddingInlineSM: theme.space.sm,
      paddingInline: theme.space.m,
      paddingInlineLG: theme.space.ml,
      contentFontSizeSM: ANTD_FONT_SIZE_SM,
      contentFontSize: ANTD_FONT_SIZE_SM,
      contentFontSizeLG: ANTD_FONT_SIZE_LG,
    },
    Switch: {
      colorPrimary: colors.statusPositivePrimary,
      colorPrimaryHover: colors.statusPositivePrimary,
      colorTextQuaternary: colors.borderOutline,
      colorTextTertiary: colors.textTertiary,
    },
    Segmented: {
      trackBg: colors.backgroundPrimary,
      trackPadding: ANTD_SEGMENTED_TRACK_PADDING,
      itemColor: colors.textSecondary,
      itemHoverColor: colors.textPrimary,
      itemHoverBg: colors.transparent,
      itemActiveBg: colors.transparent,
      itemSelectedBg: colors.backgroundTertiary,
      itemSelectedColor: colors.textPrimary,
      borderRadius: ANTD_BORDER_RADIUS_LG,
      borderRadiusSM: ANTD_BORDER_RADIUS_SM,
    },
  };
}

export function buildAntdTheme({ colors, isDark }: TBuildAntdThemeParams): ThemeConfig {
  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: buildToken(colors),
    components: buildComponents(colors),
  };
}
