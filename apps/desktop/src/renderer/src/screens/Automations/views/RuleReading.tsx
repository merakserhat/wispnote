import Box from 'components/core/Box';
import Text from 'components/core/Text';

import RuleCheckState from 'enums/RuleCheckState';

import {
  RULE_CHECKING_SLOW_TEXT,
  RULE_CHECKING_TEXT,
  RULE_COULDNT_CHECK_TEXT,
  RULE_MISSING_GROUP_TAIL,
} from '../Automations.constants';
import { TRuleReadingProps } from '../Automations.types';
import RuleGroupChip from './RuleGroupChip';
import RuleStateIcon from './RuleStateIcon';

function RuleReading({ check }: TRuleReadingProps) {
  const { state, isSlow, details, group, groupTitle, missingGroupReason } = check;
  const hasGroupLine = state === RuleCheckState.READY || state === RuleCheckState.NEEDS_GROUP;

  return (
    <Box
      flexDirection="row"
      alignItems={hasGroupLine ? 'center' : 'flex-start'}
      gap="s"
      minWidth={0}>
      <Box pt={hasGroupLine ? 'none' : 'xxs'}>
        <RuleStateIcon state={state} />
      </Box>
      {state === RuleCheckState.CHECKING && (
        <Text variant="bodySub" color="textTertiary">
          {isSlow ? RULE_CHECKING_SLOW_TEXT : RULE_CHECKING_TEXT}
        </Text>
      )}
      {state === RuleCheckState.COULDNT_CHECK && (
        <Text variant="bodySub" color="textSecondary">
          {RULE_COULDNT_CHECK_TEXT}
        </Text>
      )}
      {state === RuleCheckState.NEEDS_REWORDING && (
        <Text variant="bodySub" color="statusErrorPrimary">
          {details}
        </Text>
      )}
      {hasGroupLine && (
        <Text as="div" variant="bodySub" color="textSecondary">
          <RuleGroupChip
            group={group}
            title={groupTitle ?? ''}
            missing={state === RuleCheckState.NEEDS_GROUP}
          />
          {missingGroupReason && RULE_MISSING_GROUP_TAIL[missingGroupReason]}
        </Text>
      )}
    </Box>
  );
}

export default RuleReading;
