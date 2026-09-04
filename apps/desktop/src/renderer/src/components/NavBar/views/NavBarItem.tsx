import { createElement } from 'react';

import Text from 'components/core/Text';

import { NAV_BAR_ITEM_SIZE_MAP } from '../NavBar.constants';
import { StyledNavBarItem } from '../NavBar.styles';
import { TNavBarItemProps } from '../NavBar.types';

function NavBarItem({ label, icon, isActive = false, size = 'medium', onPress }: TNavBarItemProps) {
  const { iconSize, paddingY, textVariant } = NAV_BAR_ITEM_SIZE_MAP[size];

  return (
    <StyledNavBarItem
      type="button"
      $isActive={isActive}
      $paddingY={paddingY}
      aria-current={isActive ? 'page' : undefined}
      onClick={onPress}>
      {createElement(icon, {
        width: iconSize,
        height: iconSize,
        strokeWidth: 1.75,
        iconColor: isActive ? 'textPrimary' : 'textSecondary',
      })}
      <Text
        as="span"
        variant={textVariant}
        color={isActive ? 'textPrimary' : 'textSecondary'}
        numberOfLines={1}>
        {label}
      </Text>
    </StyledNavBarItem>
  );
}

export default NavBarItem;
