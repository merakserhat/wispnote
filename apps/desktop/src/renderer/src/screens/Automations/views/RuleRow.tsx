import { useState } from 'react';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import IconButton from 'components/core/IconButton';
import SwitchButton from 'components/core/SwitchButton';
import Text from 'components/core/Text';
import { PlusIcon, Trash01Icon } from 'components/Icons';

import { useDeleteAutomation } from 'api/automations';
import { useCreateNoteGroup } from 'api/noteGroups';
import RuleCheckState from 'enums/RuleCheckState';

import { RULE_STATE_ICON_SIZE } from '../Automations.constants';
import { useArrivalHighlight, useOptimisticToggle } from '../Automations.hooks';
import { RuleRowRoot, RuleToggle } from '../Automations.styles';
import { TRuleRowProps } from '../Automations.types';
import RuleEditor from './RuleEditor';
import RuleReading from './RuleReading';

function RuleRow({ automation, check, onRecheck }: TRuleRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toggle } = useOptimisticToggle();
  const { deleteAutomation, isPending: isDeleting } = useDeleteAutomation();
  const { createNoteGroup, isPending: isCreating, error: createError } = useCreateNoteGroup();
  const { isHighlighted, endHighlight } = useArrivalHighlight(check.state);

  const needsGroup = check.state === RuleCheckState.NEEDS_GROUP && Boolean(check.groupTitle);

  function handleToggle(enabled: boolean) {
    toggle({ automationId: automation.id, enabled });
  }

  function handleDelete() {
    deleteAutomation({ automationId: automation.id });
  }

  function startEditing() {
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
  }

  function handleSaved() {
    onRecheck(automation.id, automation.checkRun);
  }

  function handleCreateGroup() {
    if (check.groupTitle) {
      createNoteGroup({ title: check.groupTitle });
    }
  }

  const reading = <RuleReading check={check} />;

  return (
    <RuleRowRoot
      position="relative"
      flexDirection="row"
      alignItems="flex-start"
      gap="ml"
      py="m"
      borderBottom="1px solid"
      borderColor="borderDivider"
      $highlight={isHighlighted}
      onAnimationEnd={endHighlight}>
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
      <Box flex={1} minWidth={0} gap="s">
        {isEditing ? (
          <RuleEditor automation={automation} onClose={stopEditing} onSaved={handleSaved}>
            {reading}
          </RuleEditor>
        ) : (
          <Box gap="xs">
            <RuleToggle type="button" onClick={startEditing}>
              <Text
                as="span"
                variant="body"
                color={automation.enabled ? 'textPrimary' : 'textTertiary'}>
                {automation.ruleText}
              </Text>
            </RuleToggle>
            {reading}
            {check.previous && (
              <Box opacity={0.45}>
                <RuleReading check={check.previous} />
              </Box>
            )}
          </Box>
        )}
        {needsGroup && !isEditing && (
          <Box flexDirection="row" gap="s">
            <Box width={RULE_STATE_ICON_SIZE} flexShrink={0} />
            <Box alignItems="flex-start" gap="xs">
              <Button
                label={`Create ${check.groupTitle}`}
                variant="primary"
                size="small"
                leftIcon={PlusIcon}
                loading={isCreating}
                onPress={handleCreateGroup}
              />
              {createError && (
                <Text variant="caption" color="statusErrorPrimary">
                  {createError.errorMessage}
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </RuleRowRoot>
  );
}

export default RuleRow;
