import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import { useCreateAutomation } from 'api/automations';

import { TAutomationSuggestion } from 'shared/types/automation.types';

import { RULE_DEFAULT_VALUES, RULE_PLACEHOLDER, ruleSchema } from '../Automations.constants';
import { TRuleFormValues } from '../Automations.types';
import SuggestionChips from './SuggestionChips';

function RuleComposer() {
  const { control, handleSubmit, reset, watch, setValue } = useForm<TRuleFormValues>({
    resolver: yupResolver(ruleSchema),
    defaultValues: RULE_DEFAULT_VALUES,
  });

  const { createAutomation, isPending, error } = useCreateAutomation({
    onSuccess: () => reset(),
  });

  const submit = handleSubmit((values) => createAutomation(values));
  const draft = watch('ruleText');
  const canSubmit = draft.trim().length > 0;

  function handleSelectSuggestion({ ruleText }: TAutomationSuggestion) {
    setValue('ruleText', ruleText, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <form onSubmit={submit}>
      <Box gap="s">
        <Box flexDirection="row" alignItems="flex-start" gap="sm">
          <Box flex={1} minWidth={0}>
            <FormInput<TRuleFormValues>
              control={control}
              name="ruleText"
              placeholder={RULE_PLACEHOLDER}
              size="large"
              autoFocus
            />
          </Box>
          <Button
            label="Add rule"
            variant="primary"
            size="large"
            htmlType="submit"
            loading={isPending}
            disabled={!canSubmit}
          />
        </Box>
        {error && (
          <Text variant="caption" color="statusErrorPrimary">
            {error.errorMessage}
          </Text>
        )}
        {!draft && <SuggestionChips onSelect={handleSelectSuggestion} />}
      </Box>
    </form>
  );
}

export default RuleComposer;
