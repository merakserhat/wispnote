import NavItem from 'enums/NavItem';

import { TNavigationContext } from './NavigationProvider.types';

export const DEFAULT_NAV_ITEM = NavItem.NOTES;

export const INITIAL_NAVIGATION_CONTEXT: TNavigationContext = {
  activeItem: DEFAULT_NAV_ITEM,
  navigate: () => undefined,
};
