import { useEffect, useState } from 'react';

import { SYSTEM_DARK_QUERY } from './useIsSystemDark.constants';

function useIsSystemDark(): boolean {
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

export default useIsSystemDark;
