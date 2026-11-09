import { useNavigate } from '@tanstack/react-router';

import Box from 'components/core/Box';
import Card from 'components/core/Card';
import Text from 'components/core/Text';
import { LayersTwo01Icon } from 'components/Icons';

import { RULE_CHIP_ICON_SIZE, RULE_CHIP_MIN_HEIGHT } from '../Automations.constants';
import { TRuleGroupChipProps } from '../Automations.types';

function RuleGroupChip({ group, title, missing }: TRuleGroupChipProps) {
  const navigate = useNavigate();

  function handlePress() {
    if (group) {
      navigate({ to: '/groups/$noteGroupId', params: { noteGroupId: group.id } });
    }
  }

  if (missing) {
    return (
      <Box display="inline-flex" verticalAlign="middle" mx="xxs">
        <Box
          display="inline-flex"
          flexDirection="row"
          alignItems="center"
          gap="xs"
          minHeight={RULE_CHIP_MIN_HEIGHT}
          px="s"
          borderWidth={1}
          borderStyle="dashed"
          borderColor="borderOutline"
          borderRadius={6}>
          <LayersTwo01Icon
            width={RULE_CHIP_ICON_SIZE}
            height={RULE_CHIP_ICON_SIZE}
            iconColor="textTertiary"
          />
          <Text as="span" variant="bodySubBold" color="textSecondary">
            {title}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="inline-flex" verticalAlign="middle" mx="xxs">
      <Card
        variant="outlined"
        display="inline-flex"
        minHeight={RULE_CHIP_MIN_HEIGHT}
        px="s"
        borderRadius={6}
        onPress={group ? handlePress : undefined}>
        <Box flexDirection="row" alignItems="center" gap="xs">
          <LayersTwo01Icon
            width={RULE_CHIP_ICON_SIZE}
            height={RULE_CHIP_ICON_SIZE}
            iconColor="textTertiary"
          />
          <Text as="span" variant="bodySubBold">
            {title}
          </Text>
        </Box>
      </Card>
    </Box>
  );
}

export default RuleGroupChip;
