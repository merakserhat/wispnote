import { ChangeEvent } from 'react';

import Text from 'components/core/Text';

import { InputWrapper, StyledInput, StyledPasswordInput } from './Input.styles';
import { TInputProps } from './Input.types';

function Input({
  value,
  onChangeText,
  label,
  error,
  secure = false,
  disabled,
  placeholder,
  autoFocus,
  onBlur,
  name,
  size,
  className,
}: TInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeText(event.target.value);
  }

  const InputComponent = secure ? StyledPasswordInput : StyledInput;

  return (
    <InputWrapper className={className}>
      {label ? (
        <Text variant="label" muted>
          {label}
        </Text>
      ) : null}
      <InputComponent
        name={name}
        size={size}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        status={error ? 'error' : undefined}
        onChange={handleChange}
        onBlur={onBlur}
      />
      {error ? (
        <Text variant="meta" color="danger">
          {error}
        </Text>
      ) : null}
    </InputWrapper>
  );
}

export default Input;
