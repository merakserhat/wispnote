import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useSessionExpiry() {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      window.wisp.onSessionExpired(() => {
        queryClient.clear();
      }),
    [queryClient]
  );
}
