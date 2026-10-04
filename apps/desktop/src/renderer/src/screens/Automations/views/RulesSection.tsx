import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { useGetAutomations } from 'api/automations';

import { RULES_FIRST_PAGE, RULES_PAGE_SIZE, RULES_SORT } from '../Automations.constants';
import RulesContent from './RulesContent';

function RulesSection() {
  const { data, isPending, isError } = useGetAutomations({
    options: { page: RULES_FIRST_PAGE, size: RULES_PAGE_SIZE, ...RULES_SORT },
  });

  return (
    <Box gap="sm">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
        <Text variant="label" color="textTertiary">
          Your rules
        </Text>
        {data && (
          <Text variant="label" color="textTertiary">
            {`${data.activeCount} active`}
          </Text>
        )}
      </Box>
      <Box borderTop="1px solid" borderColor="borderDivider">
        <RulesContent automations={data?.content ?? []} isPending={isPending} isError={isError} />
      </Box>
    </Box>
  );
}

export default RulesSection;
