import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { ArrowLeftIcon, Trash01Icon } from 'components/Icons';
import NotesFeed from 'components/NotesFeed';
import PageHeader from 'components/PageHeader';

import { useDeleteNoteGroup, useGetNoteGroupDetail } from 'api/noteGroups';

import { formatNoteGroupMeta } from '../NoteGroups.helpers';
import { TNoteGroupDetailProps } from '../NoteGroups.types';

function NoteGroupDetail({ group, onBack }: TNoteGroupDetailProps) {
  const { data } = useGetNoteGroupDetail({ options: { noteGroupId: group.id } });
  const { deleteNoteGroup, isPending: isDeleting } = useDeleteNoteGroup({ onSuccess: onBack });
  const current = data ?? group;

  function handleDelete() {
    deleteNoteGroup({ noteGroupId: group.id });
  }

  return (
    <Box gap="l">
      <Box alignItems="flex-start">
        <Button
          label="All groups"
          variant="ghost"
          size="small"
          leftIcon={ArrowLeftIcon}
          onPress={onBack}
        />
      </Box>
      <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="ml">
        <PageHeader title={current.title} description={current.description ?? undefined} />
        <Button
          label="Delete group"
          variant="error"
          size="small"
          leftIcon={Trash01Icon}
          loading={isDeleting}
          onPress={handleDelete}
        />
      </Box>
      <Text variant="bodySub" color="textSecondary">
        {formatNoteGroupMeta(current.noteCount)}
      </Text>
      <NotesFeed noteGroup={current} />
    </Box>
  );
}

export default NoteGroupDetail;
