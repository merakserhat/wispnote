import { useState } from 'react';

import Box from 'components/core/Box';
import PageHeader from 'components/PageHeader';

import useDebouncedValue from 'hooks/useDebouncedValue';
import { TNoteGroup } from 'shared/types/noteGroup.types';

import { NOTE_GROUPS_PAGE_DESCRIPTION } from './NoteGroups.constants';
import NoteGroupDetail from './views/NoteGroupDetail';
import NoteGroupForm from './views/NoteGroupForm';
import NoteGroupsContent from './views/NoteGroupsContent';
import NoteGroupsToolbar from './views/NoteGroupsToolbar';

function NoteGroups() {
  const [selectedGroup, setSelectedGroup] = useState<TNoteGroup | null>(null);
  const [search, setSearch] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search).trim();

  function clearSelectedGroup() {
    setSelectedGroup(null);
  }

  function openComposer() {
    setIsComposerOpen(true);
  }

  function closeComposer() {
    setIsComposerOpen(false);
  }

  if (selectedGroup) {
    return <NoteGroupDetail group={selectedGroup} onBack={clearSelectedGroup} />;
  }

  return (
    <Box gap="l">
      <PageHeader title="Groups" description={NOTE_GROUPS_PAGE_DESCRIPTION} />
      <NoteGroupsToolbar search={search} onSearchChange={setSearch} onNewGroup={openComposer} />
      {isComposerOpen && <NoteGroupForm onClose={closeComposer} />}
      <NoteGroupsContent search={debouncedSearch} onSelectGroup={setSelectedGroup} />
    </Box>
  );
}

export default NoteGroups;
