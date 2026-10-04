import Box from 'components/core/Box';
import IconButton from 'components/core/IconButton';
import SwitchButton from 'components/core/SwitchButton';
import Text from 'components/core/Text';
import { Trash01Icon } from 'components/Icons';

import { useDeleteAutomation } from 'api/automations';

import { formatRelativeTime } from 'helpers/date';

import { useOptimisticToggle } from '../Automations.hooks';
import { TRuleRowProps } from '../Automations.types';

function RuleRow({ automation }: TRuleRowProps) {
  const { toggle } = useOptimisticToggle();
  const { deleteAutomation, isPending: isDeleting } = useDeleteAutomation();

  function handleToggle(enabled: boolean) {
    toggle({ automationId: automation.id, enabled });
  }

  function handleDelete() {
    deleteAutomation({ automationId: automation.id });
  }

  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      gap="ml"
      py="m"
      borderBottom="1px solid"
      borderColor="borderDivider">
      <Box flexDirection="row" alignItems="center" gap="s">
        <SwitchButton
          name={`rule-${automation.id}`}
          value={automation.enabled}
          onChange={handleToggle}
          size="small"
          disabled={isDeleting}
        />
        <IconButton
          icon={Trash01Icon}
          variant="secondary"
          size="small"
          loading={isDeleting}
          onPress={handleDelete}
        />
      </Box>
      <Box flex={1} gap="xs">
        <Text variant="body" color={automation.enabled ? 'textPrimary' : 'textTertiary'}>
          {automation.ruleText}
        </Text>
        <Text variant="caption" color="textTertiary">
          {`Added ${formatRelativeTime(automation.createdAt)}`}
        </Text>
      </Box>
    </Box>
  );
}

export default RuleRow;
