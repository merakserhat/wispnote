import { ComponentType } from 'react';

import Settings from 'screens/Settings';
import Sources from 'screens/Sources';

import NavItem from 'enums/NavItem';

import PlaceholderScreen from './views/PlaceholderScreen';

export const HOME_SCREEN_MAP: Record<NavItem, ComponentType> = {
  [NavItem.NOTES]: PlaceholderScreen,
  [NavItem.SOURCES]: Sources,
  [NavItem.AUTOMATIONS]: PlaceholderScreen,
  [NavItem.SETTINGS]: Settings,
};
