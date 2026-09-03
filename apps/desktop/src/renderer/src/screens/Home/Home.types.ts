import { TMember } from 'shared/types/auth.types';

export type THomeProps = {
  member: TMember;
};

export type TNavItemKey = 'notes' | 'sources' | 'settings';

export type TNavItem = {
  key: TNavItemKey;
  label: string;
};

export type TSidebarProps = {
  activeKey: TNavItemKey;
  onSelect: (key: TNavItemKey) => void;
};

export type TSidebarItemProps = {
  item: TNavItem;
  isActive: boolean;
  onSelect: (key: TNavItemKey) => void;
};
