import Box from 'components/core/Box';
import NotesFeed from 'components/NotesFeed';
import PageHeader from 'components/PageHeader';

import { useGetMember } from 'api/auth';

import { NOTES_PAGE_DESCRIPTION } from './Notes.constants';

function Notes() {
  const { data: member } = useGetMember();

  const firstName = member?.email.split('@')[0] ?? '';
  const title = firstName
    ? `Welcome back, ${firstName.charAt(0).toUpperCase()}${firstName.slice(1)}`
    : 'Welcome back';

  return (
    <Box gap="l">
      <PageHeader title={title} description={NOTES_PAGE_DESCRIPTION} />
      <NotesFeed />
    </Box>
  );
}

export default Notes;
