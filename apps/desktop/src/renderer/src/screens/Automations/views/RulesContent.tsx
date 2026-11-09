import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TRulesContentProps } from '../Automations.types';
import RuleRow from './RuleRow';

function RulesContent({ rows, isPending, isError, onRecheck }: TRulesContentProps) {
  if (isPending) {
    return <></>;
  }

  if (isError) {
    return (
      <Box py="xl" alignItems="center">
        <Text variant="body" color="statusErrorPrimary">
          Rules could not be loaded.
        </Text>
      </Box>
    );
  }

  if (!rows.length) {
    return (
      <Box py="xl" alignItems="center">
        <Text variant="body" color="textSecondary">
          No rules yet.
        </Text>
      </Box>
    );
  }

  return (
    <>
      {rows.map(({ automation, check }) => (
        <RuleRow key={automation.id} automation={automation} check={check} onRecheck={onRecheck} />
      ))}
    </>
  );
}

export default RulesContent;
