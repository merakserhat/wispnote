import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import Box from 'components/core/Box';
import PageHeader from 'components/PageHeader';

import useDebouncedValue from 'hooks/useDebouncedValue';
import { TNoteGroup } from 'shared/types/noteGroup.types';

import { NOTE_GROUPS_PAGE_DESCRIPTION } from './NoteGroups.constants';
import NoteGroupForm from './views/NoteGroupForm';
import NoteGroupsContent from './views/NoteGroupsContent';
import NoteGroupsToolbar from './views/NoteGroupsToolbar';

function NoteGroups() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search).trim();

  function openGroup(group: TNoteGroup) {
    navigate({ to: '/groups/$noteGroupId', params: { noteGroupId: group.id } });
  }

  function openComposer() {
    setIsComposerOpen(true);
  }

  function closeComposer() {
    setIsComposerOpen(false);
  }

  return (
    <Box gap="l">
      <PageHeader title="Groups" description={NOTE_GROUPS_PAGE_DESCRIPTION} />
      <NoteGroupsToolbar search={search} onSearchChange={setSearch} onNewGroup={openComposer} />
      {isComposerOpen && <NoteGroupForm onClose={closeComposer} />}
      <NoteGroupsContent search={debouncedSearch} onSelectGroup={openGroup} />
    </Box>
  );
}

export default NoteGroups;
