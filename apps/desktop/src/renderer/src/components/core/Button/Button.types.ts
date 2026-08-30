import type { ButtonProps } from 'antd';

export type TButtonVariant = 'primary' | 'secondary';

export type TButtonProps = Pick<ButtonProps, 'icon' | 'block' | 'htmlType'> & {
  label: string;
  variant?: TButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  className?: string;
};
