import { useEffect, useState } from 'react';

import { DEBOUNCE_DELAY_MS } from './useDebouncedValue.constants';

function useDebouncedValue<TValue>(value: TValue, delayMs: number = DEBOUNCE_DELAY_MS): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

export default useDebouncedValue;
