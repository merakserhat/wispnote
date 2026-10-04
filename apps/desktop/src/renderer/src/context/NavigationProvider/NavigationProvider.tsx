import { createContext, useMemo, useState } from 'react';

import { DEFAULT_NAV_ITEM, INITIAL_NAVIGATION_CONTEXT } from './NavigationProvider.constants';
import { TNavigationContext, TNavigationProviderProps } from './NavigationProvider.types';

export const NavigationContext = createContext<TNavigationContext>(INITIAL_NAVIGATION_CONTEXT);

function NavigationProvider({
  children,
  initialItem = DEFAULT_NAV_ITEM,
}: TNavigationProviderProps) {
  const [activeItem, setActiveItem] = useState(initialItem);

  const value = useMemo<TNavigationContext>(
    () => ({ activeItem, navigate: setActiveItem }),
    [activeItem]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export default NavigationProvider;
