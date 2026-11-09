import { useEffect, useMemo } from 'react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { useGetAutomations } from 'api/automations';
import { useGetNoteGroups } from 'api/noteGroups';
import usePolling from 'hooks/usePolling';

import { RULES_FIRST_PAGE, RULES_PAGE_SIZE, RULES_SORT } from '../Automations.constants';
import {
  countRules,
  formatAttentionCount,
  getRulesPollingAnchor,
  resolveRuleCheck,
} from '../Automations.helpers';
import { useRuleCheckTracker } from '../Automations.hooks';
import { TRuleRow } from '../Automations.types';
import RulesContent from './RulesContent';

function RulesSection() {
  const { refetchInterval, now, startPolling, stopPolling } = usePolling();

  const { data, isPending, isError } = useGetAutomations({
    options: { page: RULES_FIRST_PAGE, size: RULES_PAGE_SIZE, ...RULES_SORT },
    queryParams: { refetchInterval },
  });
  const { data: groups } = useGetNoteGroups({ options: {} });

  const automations = useMemo(() => data?.content ?? [], [data]);
  const { recheckById, checkingSinceById, markRecheck } = useRuleCheckTracker(automations);

  const rows: TRuleRow[] = automations.map((automation) => ({
    automation,
    check: resolveRuleCheck({
      automation,
      groups,
      now,
      recheck: recheckById[automation.id],
      checkingSince: checkingSinceById[automation.id],
    }),
  }));
  const counts = countRules(rows);
  const pollingAnchor = getRulesPollingAnchor(rows);

  useEffect(() => {
    if (pollingAnchor === undefined) {
      stopPolling();
      return;
    }

    startPolling(pollingAnchor);
  }, [pollingAnchor, startPolling, stopPolling]);

  return (
    <Box gap="sm">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
        <Text variant="label" color="textTertiary">
          Your rules
        </Text>
        {data && (
          <Text variant="label" color="textTertiary">
            {`${counts.active} active`}
            {counts.attention > 0 && (
              <>
                {' · '}
                <Text as="span" variant="label" color="textSecondary">
                  {formatAttentionCount(counts.attention)}
                </Text>
              </>
            )}
          </Text>
        )}
      </Box>
      <Box borderTop="1px solid" borderColor="borderDivider">
        <RulesContent rows={rows} isPending={isPending} isError={isError} onRecheck={markRecheck} />
      </Box>
    </Box>
  );
}

export default RulesSection;
