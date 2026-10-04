import { BUTTON_SIZE_MAP, BUTTON_VARIANT_MAP } from './Button.constants';
import { ButtonLabel, StyledButton } from './Button.styles';
import { TButtonProps } from './Button.types';

function Button({
  label,
  variant = 'primary',
  size = 'medium',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  disabled = false,
  block = false,
  onPress,
  htmlType = 'button',
  className,
}: TButtonProps) {
  const { antdSize, iconSize } = BUTTON_SIZE_MAP[size];
  const Icon = LeftIcon ?? RightIcon;

  return (
    <StyledButton
      className={className}
      {...BUTTON_VARIANT_MAP[variant]}
      size={antdSize}
      htmlType={htmlType}
      icon={Icon ? <Icon width={iconSize} height={iconSize} /> : undefined}
      iconPlacement={LeftIcon ? 'start' : 'end'}
      loading={loading}
      disabled={disabled}
      block={block}
      onClick={onPress}>
      <ButtonLabel>{label}</ButtonLabel>
    </StyledButton>
  );
}

export default Button;
