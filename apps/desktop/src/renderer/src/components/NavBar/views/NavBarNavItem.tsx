import { useMatchRoute, useNavigate } from '@tanstack/react-router';

import { getIconByNavItem, getLabelByNavItem, getPathByNavItem } from 'enums/NavItem';

import { TNavBarNavItemProps } from '../NavBar.types';
import NavBarItem from './NavBarItem';

function NavBarNavItem({ item, size }: TNavBarNavItemProps) {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const path = getPathByNavItem(item);
  const isActive = Boolean(matchRoute({ to: path, fuzzy: true }));

  function handlePress() {
    navigate({ to: path });
  }

  return (
    <NavBarItem
      label={getLabelByNavItem(item)}
      icon={getIconByNavItem(item)}
      isActive={isActive}
      size={size}
      onPress={handlePress}
    />
  );
}

export default NavBarNavItem;
