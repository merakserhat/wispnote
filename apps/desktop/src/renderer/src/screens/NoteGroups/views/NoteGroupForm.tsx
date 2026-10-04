import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import { useCreateNoteGroup, useGetNoteGroups } from 'api/noteGroups';

import { NOTE_GROUP_DEFAULT_VALUES, groupSchema } from '../NoteGroups.constants';
import {
  formatDuplicateTitleMessage,
  getCreateNoteGroupErrorMessage,
  isDuplicateNoteGroupTitle,
} from '../NoteGroups.helpers';
import { TNoteGroupFormProps, TNoteGroupFormValues } from '../NoteGroups.types';

function NoteGroupForm({ onClose }: TNoteGroupFormProps) {
  const { control, handleSubmit, setError } = useForm<TNoteGroupFormValues>({
    resolver: yupResolver(groupSchema),
    defaultValues: NOTE_GROUP_DEFAULT_VALUES,
  });

  const { data: groups = [] } = useGetNoteGroups({ options: {} });
  const { createNoteGroup, isPending, error } = useCreateNoteGroup({ onSuccess: onClose });

  const submit = handleSubmit(({ title, description }) => {
    if (isDuplicateNoteGroupTitle(groups, title)) {
      setError('title', { message: formatDuplicateTitleMessage(title) });
      return;
    }

    createNoteGroup({ title, description: description || undefined });
  });

  return (
    <Card variant="outlined" p="m">
      <form onSubmit={submit}>
        <Box gap="sm">
          <FormInput<TNoteGroupFormValues>
            control={control}
            name="title"
            label="Title"
            placeholder="Thesis reading"
            autoFocus
          />
          <FormInput<TNoteGroupFormValues>
            control={control}
            name="description"
            label="Description (optional)"
            placeholder="Highlights for chapter 2"
          />
          {error && (
            <Text variant="caption" color="statusErrorPrimary">
              {getCreateNoteGroupErrorMessage(error)}
            </Text>
          )}
          <Box flexDirection="row" justifyContent="flex-end" gap="s">
            <Button label="Cancel" variant="secondary" onPress={onClose} />
            <Button label="Create group" variant="primary" htmlType="submit" loading={isPending} />
          </Box>
        </Box>
      </form>
    </Card>
  );
}

export default NoteGroupForm;
