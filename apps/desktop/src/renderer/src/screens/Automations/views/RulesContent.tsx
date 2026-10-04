import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TRulesContentProps } from '../Automations.types';
import RuleRow from './RuleRow';

function RulesContent({ automations, isPending, isError }: TRulesContentProps) {
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

  if (!automations.length) {
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
      {automations.map((automation) => (
        <RuleRow key={automation.id} automation={automation} />
      ))}
    </>
  );
}

export default RulesContent;
