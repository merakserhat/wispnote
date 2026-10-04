import { TIconComponent } from 'components/Icons';

import NavItem from 'enums/NavItem';

export type TNavBarProps = {
  email: string;
};

export type TNavBarItemSize = 'medium' | 'small';

export type TNavBarItemProps = {
  label: string;
  icon: TIconComponent;
  isActive?: boolean;
  size?: TNavBarItemSize;
  onPress: () => void;
};

export type TNavBarNavItemProps = {
  item: NavItem;
  size?: TNavBarItemSize;
};

export type TNavBarItemSizeProperty = {
  iconSize: number;
  paddingY: number;
  textVariant: 'body' | 'bodySub';
};

export type TNavBarItemSizeMap = Record<TNavBarItemSize, TNavBarItemSizeProperty>;
