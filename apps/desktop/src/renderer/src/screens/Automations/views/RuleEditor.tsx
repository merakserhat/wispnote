import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import { useUpdateAutomation } from 'api/automations';

import { ruleSchema } from '../Automations.constants';
import { TRuleEditorProps, TRuleFormValues } from '../Automations.types';

function RuleEditor({ automation, onClose, onSaved, children }: TRuleEditorProps) {
  const { control, handleSubmit } = useForm<TRuleFormValues>({
    resolver: yupResolver(ruleSchema),
    defaultValues: { ruleText: automation.ruleText },
  });

  const { updateAutomation, isPending, error } = useUpdateAutomation({
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const submit = handleSubmit(({ ruleText }) => {
    const nextRuleText = ruleText.trim();

    if (nextRuleText === automation.ruleText.trim()) {
      onClose();
      return;
    }

    updateAutomation({ automationId: automation.id, ruleText: nextRuleText });
  });

  return (
    <form onSubmit={submit}>
      <Box gap="s">
        <FormInput<TRuleFormValues>
          control={control}
          name="ruleText"
          size="large"
          autoFocus
          multiline
          disabled={isPending}
          onPressEnter={submit}
          onPressEscape={onClose}
        />
        {children}
        <Box flexDirection="row" alignItems="center" gap="s">
          <Button
            label="Save and check"
            variant="primary"
            size="small"
            htmlType="submit"
            loading={isPending}
          />
          <Button
            label="Cancel"
            variant="secondary"
            size="small"
            disabled={isPending}
            onPress={onClose}
          />
        </Box>
        {error && (
          <Text variant="caption" color="statusErrorPrimary">
            {error.errorMessage}
          </Text>
        )}
      </Box>
    </form>
  );
}

export default RuleEditor;
