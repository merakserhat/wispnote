import useIsSystemDark from 'hooks/useIsSystemDark';

import { TUseIsDarkParams } from './useIsDark.types';

function useIsDark({ colorScheme = 'system' }: TUseIsDarkParams = {}): boolean {
  const isSystemDark = useIsSystemDark();

  if (colorScheme === 'system') {
    return isSystemDark;
  }

  return colorScheme === 'dark';
}

export default useIsDark;
