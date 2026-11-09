import { getRouteApi, useNavigate } from '@tanstack/react-router';

import ActivityIndicator from 'components/core/ActivityIndicator';
import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { ArrowLeftIcon, Trash01Icon } from 'components/Icons';
import NotesFeed from 'components/NotesFeed';
import PageHeader from 'components/PageHeader';

import { useDeleteNoteGroup, useGetNoteGroupDetail } from 'api/noteGroups';

import { formatNoteGroupMeta } from '../NoteGroups.helpers';

const routeApi = getRouteApi('/main-layout/groups/$noteGroupId');

function NoteGroupDetail() {
  const { noteGroupId } = routeApi.useParams();
  const navigate = useNavigate();
  const { data: group, isLoading } = useGetNoteGroupDetail({ options: { noteGroupId } });

  function goBack() {
    navigate({ to: '/groups' });
  }

  const { deleteNoteGroup, isPending: isDeleting } = useDeleteNoteGroup({ onSuccess: goBack });

  function handleDelete() {
    deleteNoteGroup({ noteGroupId });
  }

  const backButton = (
    <Box alignItems="flex-start">
      <Button
        label="All groups"
        variant="ghost"
        size="small"
        leftIcon={ArrowLeftIcon}
        onPress={goBack}
      />
    </Box>
  );

  if (isLoading) {
    return (
      <Box gap="l">
        {backButton}
        <Box py="xxl" alignItems="center">
          <ActivityIndicator color="textTertiary" />
        </Box>
      </Box>
    );
  }

  if (!group) {
    return (
      <Box gap="l">
        {backButton}
        <Box py="xxl" alignItems="center">
          <Text variant="body" color="textSecondary">
            This group no longer exists.
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box gap="l">
      {backButton}
      <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="ml">
        <PageHeader title={group.title} description={group.description ?? undefined} />
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
        {formatNoteGroupMeta(group.noteCount)}
      </Text>
      <NotesFeed noteGroup={group} />
    </Box>
  );
}

export default NoteGroupDetail;
