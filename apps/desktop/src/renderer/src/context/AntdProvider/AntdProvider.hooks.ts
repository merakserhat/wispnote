import { useEffect, useState } from 'react';

import { SYSTEM_DARK_QUERY } from './AntdProvider.constants';

export function useIsSystemDark() {
  const [isSystemDark, setIsSystemDark] = useState(
    () => window.matchMedia(SYSTEM_DARK_QUERY).matches
  );

  useEffect(() => {
    function handleSystemThemeChange(event: MediaQueryListEvent) {
      setIsSystemDark(event.matches);
    }

    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return isSystemDark;
}
