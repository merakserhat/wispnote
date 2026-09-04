import type { SwitchProps } from 'antd';

import { TSwitchButtonSize } from './SwitchButton.types';

export const SWITCH_BUTTON_ANTD_SIZE_MAP: Record<TSwitchButtonSize, SwitchProps['size']> = {
  small: 'small',
  medium: 'default',
};
