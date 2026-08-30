import { useEffect, useState } from 'react';

import { TToastPayload } from 'shared/types/ipc.types';

import { TUseToastReturn } from './useToast.types';

function useToast(): TUseToastReturn {
  const [toast, setToast] = useState<TToastPayload | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(
    () =>
      window.wisp.onToastShow((payload) => {
        setToast(payload);
        requestAnimationFrame(() => setVisible(true));
      }),
    []
  );

  useEffect(() => window.wisp.onToastHide(() => setVisible(false)), []);

  return { toast, visible };
}

export default useToast;
