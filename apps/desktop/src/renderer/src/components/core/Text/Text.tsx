import { TTextProps } from './Text.types';
import { StyledText } from './Text.styles';

function Text({ variant, color, truncate, muted, children, className }: TTextProps) {
  return (
    <StyledText
      className={className}
      $variant={variant}
      $color={color}
      $truncate={truncate}
      $muted={muted}>
      {children}
    </StyledText>
  );
}

export default Text;
