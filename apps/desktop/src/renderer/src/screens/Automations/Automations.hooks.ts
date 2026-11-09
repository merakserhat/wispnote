import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { automationsQueryKeys, useToggleAutomation } from 'api/automations';
import RuleCheckState from 'enums/RuleCheckState';
import {
  TAutomation,
  TAutomationCheckRun,
  TAutomationListResponse,
  TToggleAutomationRequestParams,
} from 'shared/types/automation.types';

import {
  applyToggleToAutomations,
  isCheckRunUnfinished,
  isRecheckFresh,
} from './Automations.helpers';
import {
  TAutomationListSnapshot,
  TRuleCheckingSinceMap,
  TRuleRecheckMap,
} from './Automations.types';

export function useOptimisticToggle() {
  const queryClient = useQueryClient();
  const snapshotRef = useRef<TAutomationListSnapshot>([]);

  const { toggleAutomation } = useToggleAutomation({
    onError: () => {
      snapshotRef.current.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
    },
  });

  async function toggle(params: TToggleAutomationRequestParams) {
    await queryClient.cancelQueries({ queryKey: automationsQueryKeys.lists() });

    snapshotRef.current = queryClient.getQueriesData<TAutomationListResponse>({
      queryKey: automationsQueryKeys.lists(),
    });

    queryClient.setQueriesData<TAutomationListResponse>(
      { queryKey: automationsQueryKeys.lists() },
      (current) => applyToggleToAutomations({ response: current, ...params })
    );

    toggleAutomation(params);
  }

  return { toggle };
}

export function useRuleCheckTracker(automations: TAutomation[]) {
  const [recheckById, setRecheckById] = useState<TRuleRecheckMap>({});
  const [checkingSinceById, setCheckingSinceById] = useState<TRuleCheckingSinceMap>({});

  useEffect(() => {
    const freshIds = Object.keys(recheckById).filter((id) => {
      const automation = automations.find((item) => item.id === id);
      return !automation || isRecheckFresh(automation.checkRun, recheckById[id]);
    });

    if (freshIds.length) {
      setRecheckById((current) =>
        Object.fromEntries(Object.entries(current).filter(([id]) => !freshIds.includes(id)))
      );
    }
  }, [automations, recheckById]);

  useEffect(() => {
    setCheckingSinceById((current) => {
      const seenAt = Date.now();
      const next = Object.fromEntries(
        automations
          .filter((automation) => isCheckRunUnfinished(automation.checkRun))
          .map((automation) => [automation.id, current[automation.id] ?? seenAt])
      );
      const unchanged =
        Object.keys(next).length === Object.keys(current).length &&
        Object.entries(next).every(([id, since]) => current[id] === since);

      return unchanged ? current : next;
    });
  }, [automations]);

  const markRecheck = useCallback((automationId: string, previous?: TAutomationCheckRun) => {
    setRecheckById((current) => ({
      ...current,
      [automationId]: { requestedAt: Date.now(), previous },
    }));
  }, []);

  return { recheckById, checkingSinceById, markRecheck };
}

export function useArrivalHighlight(state: RuleCheckState) {
  const previousState = useRef(state);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (previousState.current === RuleCheckState.NEEDS_GROUP && state === RuleCheckState.READY) {
      setIsHighlighted(true);
    }

    previousState.current = state;
  }, [state]);

  const endHighlight = useCallback(() => setIsHighlighted(false), []);

  return { isHighlighted, endHighlight };
}
