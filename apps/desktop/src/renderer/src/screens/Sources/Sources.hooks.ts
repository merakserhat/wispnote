import { useState } from 'react';

import { TSource } from 'shared/types/source.types';

export function useSelectedSource() {
  const [selectedSource, setSelectedSource] = useState<TSource | null>(null);

  function clearSelectedSource() {
    setSelectedSource(null);
  }

  return { selectedSource, selectSource: setSelectedSource, clearSelectedSource };
}
