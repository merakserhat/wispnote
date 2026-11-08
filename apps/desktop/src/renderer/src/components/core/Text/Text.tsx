import { TTextProps } from './Text.types';
import { StyledText } from './Text.styles';

function Text({
  variant = 'body',
  color = 'textPrimary',
  numberOfLines,
  nowrap = false,
  children,
  ...rest
}: TTextProps) {
  return (
    <StyledText
      $variant={variant}
      $color={color}
      $numberOfLines={numberOfLines}
      $nowrap={nowrap}
      {...rest}>
      {children}
    </StyledText>
  );
}

export default Text;
