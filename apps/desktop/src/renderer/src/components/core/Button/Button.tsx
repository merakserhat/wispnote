import { TButtonProps } from './Button.types';
import { StyledButton } from './Button.styles';

function Button({
  label,
  variant = 'secondary',
  disabled = false,
  loading = false,
  onPress,
  className,
  icon,
  block,
  htmlType = 'button',
}: TButtonProps) {
  return (
    <StyledButton
      className={className}
      type={variant === 'primary' ? 'primary' : 'default'}
      htmlType={htmlType}
      icon={icon}
      block={block}
      disabled={disabled}
      loading={loading}
      onClick={onPress}>
      {label}
    </StyledButton>
  );
}

export default Button;
