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

const MAP: Record<NavItem, { label: string; icon: TIconComponent }> = {
  [NavItem.NOTES]: { label: 'Notes', icon: File05Icon },
  [NavItem.GROUPS]: { label: 'Groups', icon: LayersTwo01Icon },
  [NavItem.SOURCES]: { label: 'Sources', icon: FolderIcon },
  [NavItem.AUTOMATIONS]: { label: 'Automations', icon: ZapIcon },
  [NavItem.SETTINGS]: { label: 'Settings', icon: Settings01Icon },
};

export function getLabelByNavItem(item: NavItem) {
  return MAP[item].label;
}

export function getIconByNavItem(item: NavItem) {
  return MAP[item].icon;
}

export default NavItem;
