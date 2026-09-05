import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { automationsQueryKeys, useToggleAutomation } from 'api/automations';
import {
  TAutomationListResponse,
  TToggleAutomationRequestParams,
} from 'shared/types/automation.types';

import { applyToggleToAutomations } from './Automations.helpers';
import { TAutomationListSnapshot } from './Automations.types';

export function useOptimisticToggle() {
  const queryClient = useQueryClient();
  const snapshotRef = useRef<TAutomationListSnapshot>([]);

  const { toggleAutomation } = useToggleAutomation({
    onError: () => {
      snapshotRef.current.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
    },
  });

  async function toggle(params: TToggleAutomationRequestParams) {
    await queryClient.cancelQueries({ queryKey: automationsQueryKeys.all });

    snapshotRef.current = queryClient.getQueriesData<TAutomationListResponse>({
      queryKey: automationsQueryKeys.all,
    });

    queryClient.setQueriesData<TAutomationListResponse>(
      { queryKey: automationsQueryKeys.all },
      (current) => applyToggleToAutomations({ response: current, ...params })
    );

    toggleAutomation(params);
  }

  return { toggle };
}
