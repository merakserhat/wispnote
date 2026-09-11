import NavItem from 'enums/NavItem';

import { TNavBarItemSizeMap } from './NavBar.types';

export const NAV_BAR_WIDTH = 236;

export const NAV_BAR_ITEMS: NavItem[] = [
  NavItem.NOTES,
  NavItem.GROUPS,
  NavItem.SOURCES,
  NavItem.AUTOMATIONS,
];

export const NAV_BAR_FOOTER_ITEMS: NavItem[] = [NavItem.SETTINGS];

export const NAV_BAR_ITEM_SIZE_MAP: TNavBarItemSizeMap = {
  medium: { iconSize: 18, paddingY: 10, textVariant: 'body' },
  small: { iconSize: 16, paddingY: 8, textVariant: 'bodySub' },
};
