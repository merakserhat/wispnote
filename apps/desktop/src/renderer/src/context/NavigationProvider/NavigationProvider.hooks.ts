import { useContext } from 'react';

import { NavigationContext } from './NavigationProvider';

export function useNavigation() {
  return useContext(NavigationContext);
}
