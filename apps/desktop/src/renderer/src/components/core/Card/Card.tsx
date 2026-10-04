import { CARD_BORDER_RADIUS, CARD_VARIANT_MAP } from './Card.constants';
import { StyledCard } from './Card.styles';
import { TCardProps } from './Card.types';

function Card({ variant = 'flat', onPress, children, ...rest }: TCardProps) {
  const { elevated, ...variantProps } = CARD_VARIANT_MAP[variant];
  const isInteractive = Boolean(onPress);

  return (
    <StyledCard
      as={isInteractive ? 'button' : undefined}
      type={isInteractive ? 'button' : undefined}
      onClick={onPress}
      borderRadius={CARD_BORDER_RADIUS}
      {...variantProps}
      {...rest}
      $elevated={elevated}
      $interactive={isInteractive}>
      {children}
    </StyledCard>
  );
}

export default Card;
