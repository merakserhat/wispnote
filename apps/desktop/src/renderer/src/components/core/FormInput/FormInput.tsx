import { Controller, FieldValues } from 'react-hook-form';

import Input from 'components/core/Input';

import { TFormInputProps } from './FormInput.types';

function FormInput<TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secure,
  multiline,
  maxRows,
  autoFocus,
  disabled,
  size,
  maxLength,
  inputMode,
  autoComplete,
  className,
  onPressEnter,
}: TFormInputProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          name={field.name}
          value={field.value}
          label={label}
          placeholder={placeholder}
          secure={secure}
          multiline={multiline}
          maxRows={maxRows}
          autoFocus={autoFocus}
          disabled={disabled}
          size={size}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={className}
          error={fieldState.error?.message}
          onChangeText={field.onChange}
          onPressEnter={onPressEnter}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

export default FormInput;
