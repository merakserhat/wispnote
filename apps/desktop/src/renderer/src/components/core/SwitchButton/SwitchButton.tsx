import Text from 'components/core/Text';

import { SWITCH_BUTTON_ANTD_SIZE_MAP } from './SwitchButton.constants';
import { StyledSwitch, SwitchButtonLabel, SwitchButtonText } from './SwitchButton.styles';
import { TSwitchButtonProps } from './SwitchButton.types';

function SwitchButton({
  name,
  value,
  onChange,
  size = 'medium',
  label,
  description,
  disabled = false,
  className,
}: TSwitchButtonProps) {
  return (
    <SwitchButtonLabel className={className} htmlFor={name} $disabled={disabled}>
      <StyledSwitch
        id={name}
        checked={value}
        onChange={onChange}
        size={SWITCH_BUTTON_ANTD_SIZE_MAP[size]}
        disabled={disabled}
      />
      {label ? (
        <SwitchButtonText>
          <Text as="span" variant="bodySub">
            {label}
          </Text>
          {description ? (
            <Text as="span" variant="caption" color="textTertiary">
              {description}
            </Text>
          ) : null}
        </SwitchButtonText>
      ) : null}
    </SwitchButtonLabel>
  );
}

export default SwitchButton;
