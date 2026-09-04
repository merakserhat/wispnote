import NavItem from 'enums/NavItem';
import { TChildrenOnly } from 'types/common';

export type TNavigationContext = {
  activeItem: NavItem;
  navigate: (item: NavItem) => void;
};

export type TNavigationProviderProps = TChildrenOnly & {
  initialItem?: NavItem;
};
