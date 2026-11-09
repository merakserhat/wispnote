import ActivityIndicator from 'components/core/ActivityIndicator';
import Box from 'components/core/Box';

import RuleCheckState, {
  getColorByRuleCheckState,
  getIconByRuleCheckState,
} from 'enums/RuleCheckState';

import { RULE_STATE_ICON_SIZE } from '../Automations.constants';
import { TRuleStateIconProps } from '../Automations.types';

function RuleStateIcon({ state }: TRuleStateIconProps) {
  const Icon = getIconByRuleCheckState(state);
  const color = getColorByRuleCheckState(state);

  return (
    <Box flexShrink={0}>
      {state === RuleCheckState.CHECKING && (
        <ActivityIndicator size={RULE_STATE_ICON_SIZE} color={color} />
      )}
      {state !== RuleCheckState.CHECKING && (
        <Icon width={RULE_STATE_ICON_SIZE} height={RULE_STATE_ICON_SIZE} iconColor={color} />
      )}
    </Box>
  );
}

export default RuleStateIcon;
