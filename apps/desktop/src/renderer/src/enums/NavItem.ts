import {
  File05Icon,
  FolderIcon,
  LayersTwo01Icon,
  Settings01Icon,
  TIconComponent,
  ZapIcon,
} from 'components/Icons';

enum NavItem {
  NOTES = 'NOTES',
  GROUPS = 'GROUPS',
  SOURCES = 'SOURCES',
  AUTOMATIONS = 'AUTOMATIONS',
  SETTINGS = 'SETTINGS',
}

export type TNavItemPath = '/notes' | '/groups' | '/sources' | '/automations' | '/settings';

const MAP: Record<NavItem, { label: string; icon: TIconComponent; path: TNavItemPath }> = {
  [NavItem.NOTES]: { label: 'Notes', icon: File05Icon, path: '/notes' },
  [NavItem.GROUPS]: { label: 'Groups', icon: LayersTwo01Icon, path: '/groups' },
  [NavItem.SOURCES]: { label: 'Sources', icon: FolderIcon, path: '/sources' },
  [NavItem.AUTOMATIONS]: { label: 'Automations', icon: ZapIcon, path: '/automations' },
  [NavItem.SETTINGS]: { label: 'Settings', icon: Settings01Icon, path: '/settings' },
};

export function getLabelByNavItem(item: NavItem) {
  return MAP[item].label;
}

export function getIconByNavItem(item: NavItem) {
  return MAP[item].icon;
}

export function getPathByNavItem(item: NavItem) {
  return MAP[item].path;
}

export default NavItem;
