import { Controller, FieldValues } from 'react-hook-form';

import Input from 'components/core/Input';

import { TFormInputProps } from './FormInput.types';

function FormInput<TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secure,
  autoFocus,
  disabled,
  size,
}: TFormInputProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={function renderInput({ field, fieldState }) {
        return (
          <Input
            name={field.name}
            value={field.value}
            label={label}
            placeholder={placeholder}
            secure={secure}
            autoFocus={autoFocus}
            disabled={disabled}
            size={size}
            error={fieldState.error?.message}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        );
      }}
    />
  );
}

export default FormInput;
