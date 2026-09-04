export type TSwitchButtonSize = 'small' | 'medium';

export type TSwitchButtonProps = {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  size?: TSwitchButtonSize;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};
