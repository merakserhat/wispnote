import * as yup from 'yup';

import RuleCheckState from 'enums/RuleCheckState';
import RuleMissingGroupReason from 'enums/RuleMissingGroupReason';
import { TAutomationsFilterParams } from 'shared/types/automation.types';

import { TRuleFormValues } from './Automations.types';

export const AUTOMATIONS_PAGE_DESCRIPTION =
  'Describe a rule in a sentence. It runs on every new highlight the moment it is saved.';

export const RULE_PLACEHOLDER =
  'If a note comes from Mail and mentions a deadline, add it to my to-do list';

export const RULE_TEXT_MAX_LENGTH = 500;

export const ruleSchema = yup.object({
  ruleText: yup
    .string()
    .trim()
    .required('Describe the rule first')
    .max(RULE_TEXT_MAX_LENGTH, `Keep it under ${RULE_TEXT_MAX_LENGTH} characters`),
});

export const RULE_DEFAULT_VALUES: TRuleFormValues = {
  ruleText: '',
};

export const RULES_FIRST_PAGE = 0;
export const RULES_PAGE_SIZE = 100;
export const RULES_SORT: Pick<TAutomationsFilterParams, 'sortBy' | 'isAscending'> = {
  sortBy: 'createdAt',
  isAscending: false,
};

export const RULE_ARRIVAL_HIGHLIGHT_MS = 1_500;

export const RULE_STATE_ICON_SIZE = 14;
export const RULE_CHIP_ICON_SIZE = 12;
export const RULE_CHIP_MIN_HEIGHT = 22;

export const RULE_CHECKING_TEXT = 'Checking your rule…';
export const RULE_CHECKING_SLOW_TEXT = 'Still checking, this is taking longer than usual';
export const RULE_COULDNT_CHECK_TEXT = 'We couldn’t check this rule.';
export const RULE_MISSING_GROUP_TAIL: Record<RuleMissingGroupReason, string> = {
  [RuleMissingGroupReason.NOT_CREATED]: ', which you don’t have yet',
  [RuleMissingGroupReason.DELETED]: ', which no longer exists',
};

export const RULE_ATTENTION_STATES: RuleCheckState[] = [
  RuleCheckState.NEEDS_GROUP,
  RuleCheckState.NEEDS_REWORDING,
  RuleCheckState.COULDNT_CHECK,
];
