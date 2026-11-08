import type { InputProps } from 'antd';

export type TInputProps = Pick<
  InputProps,
  | 'autoFocus'
  | 'disabled'
  | 'placeholder'
  | 'name'
  | 'size'
  | 'maxLength'
  | 'inputMode'
  | 'autoComplete'
> & {
  value?: string;
  onChangeText: (value: string) => void;
  onPressEnter?: () => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
  secure?: boolean;
  multiline?: boolean;
  maxRows?: number;
  className?: string;
};
