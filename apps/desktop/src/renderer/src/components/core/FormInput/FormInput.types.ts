import { Control, FieldValues, Path } from 'react-hook-form';

import { TInputProps } from 'components/core/Input';

export type TFormInputProps<TFormValues extends FieldValues> = Omit<
  TInputProps,
  'value' | 'onChangeText' | 'error' | 'onBlur' | 'name'
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
};
