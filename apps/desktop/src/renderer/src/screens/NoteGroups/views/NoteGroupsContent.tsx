import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { useGetNoteGroups } from 'api/noteGroups';

import { formatNoNoteGroupMatch } from '../NoteGroups.helpers';
import { NoteGroupsGrid } from '../NoteGroups.styles';
import { TNoteGroupsContentProps } from '../NoteGroups.types';
import NoteGroupCard from './NoteGroupCard';

function NoteGroupsContent({ search, onSelectGroup }: TNoteGroupsContentProps) {
  const { data, isPending, isError } = useGetNoteGroups({
    options: { search: search || undefined },
  });

  if (isPending) {
    return <></>;
  }

  if (isError) {
    return (
      <Box py="xxl" alignItems="center">
        <Text variant="body" color="statusErrorPrimary">
          Groups could not be loaded.
        </Text>
      </Box>
    );
  }

  if (!data?.length) {
    return (
      <Box py="xxl" alignItems="center" gap="s">
        <Text variant="body" color="textSecondary">
          {search ? formatNoNoteGroupMatch(search) : 'No groups yet.'}
        </Text>
        {!search && (
          <Text variant="bodySub" color="textTertiary">
            Create one here, or from any note’s Add to group menu.
          </Text>
        )}
      </Box>
    );
  }

  return (
    <NoteGroupsGrid>
      {data.map((group) => (
        <NoteGroupCard key={group.id} group={group} onPress={onSelectGroup} />
      ))}
    </NoteGroupsGrid>
  );
}

export default NoteGroupsContent;
