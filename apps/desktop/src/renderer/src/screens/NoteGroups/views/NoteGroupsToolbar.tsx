import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Input from 'components/core/Input';
import { PlusIcon } from 'components/Icons';

import { NOTE_GROUPS_SEARCH_WIDTH } from '../NoteGroups.constants';
import { TNoteGroupsToolbarProps } from '../NoteGroups.types';

function NoteGroupsToolbar({ search, onSearchChange, onNewGroup }: TNoteGroupsToolbarProps) {
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
      <Box width={NOTE_GROUPS_SEARCH_WIDTH}>
        <Input
          name="groups-search"
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search groups"
        />
      </Box>
      <Button label="New group" variant="primary" leftIcon={PlusIcon} onPress={onNewGroup} />
    </Box>
  );
}

export default NoteGroupsToolbar;
