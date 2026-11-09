import { ChangeEvent, KeyboardEvent } from 'react';

import Text from 'components/core/Text';

import { InputWrapper, StyledInput, StyledPasswordInput, StyledTextArea } from './Input.styles';
import { TInputProps } from './Input.types';

const DEFAULT_MAX_ROWS = 3;

function Input({
  value,
  onChangeText,
  onPressEnter,
  onPressEscape,
  label,
  error,
  secure = false,
  multiline = false,
  maxRows = DEFAULT_MAX_ROWS,
  disabled,
  placeholder,
  autoFocus,
  onBlur,
  name,
  size,
  maxLength,
  inputMode,
  autoComplete,
  className,
}: TInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChangeText(event.target.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key === 'Escape' && onPressEscape) {
      event.preventDefault();
      onPressEscape();
      return;
    }

    if (event.key !== 'Enter' || event.shiftKey || !onPressEnter) {
      return;
    }

    event.preventDefault();
    onPressEnter();
  }

  const InputComponent = secure ? StyledPasswordInput : StyledInput;

  return (
    <InputWrapper className={className}>
      {label && (
        <Text as="label" htmlFor={name} variant="bodySubBold" color="textSecondary">
          {label}
        </Text>
      )}
      {multiline ? (
        <StyledTextArea
          id={name}
          name={name}
          size={size}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          status={error ? 'error' : undefined}
          autoSize={{ minRows: 1, maxRows }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
        />
      ) : (
        <InputComponent
          id={name}
          name={name}
          size={size}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          status={error ? 'error' : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
        />
      )}
      {error && (
        <Text variant="caption" color="statusErrorPrimary">
          {error}
        </Text>
      )}
    </InputWrapper>
  );
}

export default Input;
