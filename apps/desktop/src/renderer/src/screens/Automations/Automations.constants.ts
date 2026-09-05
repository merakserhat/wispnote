import * as yup from 'yup';

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
