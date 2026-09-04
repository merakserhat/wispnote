import { CARD_BORDER_RADIUS, CARD_VARIANT_MAP } from './Card.constants';
import { StyledCard } from './Card.styles';
import { TCardProps } from './Card.types';

function Card({ variant = 'flat', children, ...rest }: TCardProps) {
  const { elevated, ...variantProps } = CARD_VARIANT_MAP[variant];

  return (
    <StyledCard borderRadius={CARD_BORDER_RADIUS} {...variantProps} {...rest} $elevated={elevated}>
      {children}
    </StyledCard>
  );
}

export default Card;
