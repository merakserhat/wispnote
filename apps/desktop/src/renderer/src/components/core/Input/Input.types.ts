import type { InputProps } from 'antd';

export type TInputProps = Pick<
  InputProps,
  'autoFocus' | 'disabled' | 'placeholder' | 'onBlur' | 'name' | 'size'
> & {
  value?: string;
  onChangeText: (value: string) => void;
  label?: string;
  error?: string;
  secure?: boolean;
  className?: string;
};
