import Text from 'components/core/Text';
import { BUTTON_SIZE_MAP } from 'components/core/Button/Button.constants';

import { ICON_BUTTON_OUTLINE_VARIANT, ICON_BUTTON_VARIANT_MAP } from './IconButton.constants';
import { IconButtonRoot, StyledIconButton } from './IconButton.styles';
import { TIconButtonProps } from './IconButton.types';

function IconButton({
  icon: Icon,
  label,
  variant = 'primary',
  size = 'medium',
  outline = false,
  loading = false,
  disabled = false,
  onPress,
  className,
}: TIconButtonProps) {
  const { antdSize, iconSize } = BUTTON_SIZE_MAP[size];
  const variantProps =
    outline && variant === 'secondary'
      ? ICON_BUTTON_OUTLINE_VARIANT
      : ICON_BUTTON_VARIANT_MAP[variant];

  return (
    <IconButtonRoot className={className}>
      <StyledIconButton
        {...variantProps}
        shape="circle"
        size={antdSize}
        htmlType="button"
        aria-label={label}
        icon={<Icon width={iconSize} height={iconSize} />}
        loading={loading}
        disabled={disabled}
        onClick={onPress}
      />
      {label ? (
        <Text variant="caption" color={disabled ? 'textTertiary' : 'textSecondary'}>
          {label}
        </Text>
      ) : null}
    </IconButtonRoot>
  );
}

export default IconButton;
