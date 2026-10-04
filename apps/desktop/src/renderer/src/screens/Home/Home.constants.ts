import { ComponentType } from 'react';

import Automations from 'screens/Automations';
import NoteGroups from 'screens/NoteGroups';
import Notes from 'screens/Notes';
import Settings from 'screens/Settings';
import Sources from 'screens/Sources';

import NavItem from 'enums/NavItem';

export const HOME_SCREEN_MAP: Record<NavItem, ComponentType> = {
  [NavItem.NOTES]: Notes,
  [NavItem.GROUPS]: NoteGroups,
  [NavItem.SOURCES]: Sources,
  [NavItem.AUTOMATIONS]: Automations,
  [NavItem.SETTINGS]: Settings,
};
