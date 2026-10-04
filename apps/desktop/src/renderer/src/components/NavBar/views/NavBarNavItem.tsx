import { useNavigation } from 'context/NavigationProvider';
import { getIconByNavItem, getLabelByNavItem } from 'enums/NavItem';

import { TNavBarNavItemProps } from '../NavBar.types';
import NavBarItem from './NavBarItem';

function NavBarNavItem({ item, size }: TNavBarNavItemProps) {
  const { activeItem, navigate } = useNavigation();

  function handlePress() {
    navigate(item);
  }

  return (
    <NavBarItem
      label={getLabelByNavItem(item)}
      icon={getIconByNavItem(item)}
      isActive={item === activeItem}
      size={size}
      onPress={handlePress}
    />
  );
}

export default NavBarNavItem;
