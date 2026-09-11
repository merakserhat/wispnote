import { useState } from 'react';

import { useAddNoteToGroup, useCreateNoteGroup, useGetNoteGroups } from 'api/noteGroups';
import { TNoteGroup } from 'shared/types/noteGroup.types';

import { filterNoteGroups, hasNoteGroupTitle } from './NoteGroupPicker.helpers';
import { TUseNoteGroupPickerParams } from './NoteGroupPicker.types';

export function useNoteGroupPicker({ noteId, onDone }: TUseNoteGroupPickerParams) {
  const [search, setSearch] = useState('');

  const { data: groups = [], isPending, isError } = useGetNoteGroups({ options: {} });
  const {
    addNoteToGroup,
    isPending: isAdding,
    error: addError,
  } = useAddNoteToGroup({ onSuccess: onDone });
  const {
    createNoteGroup,
    isPending: isCreating,
    error: createError,
  } = useCreateNoteGroup({
    onSuccess: (group) => {
      if (group) {
        addNoteToGroup({ noteGroupId: group.id, noteId });
      }
    },
  });

  const title = search.trim();
  const options = filterNoteGroups(groups, search);
  const canCreate = title.length > 0 && !hasNoteGroupTitle(groups, title);
  const isSaving = isAdding || isCreating;

  function selectGroup(group: TNoteGroup) {
    addNoteToGroup({ noteGroupId: group.id, noteId });
  }

  function createAndAdd() {
    if (canCreate && !isSaving) {
      createNoteGroup({ title });
    }
  }

  function submit() {
    if (canCreate) {
      createAndAdd();
    } else if (options.length === 1) {
      selectGroup(options[0]);
    }
  }

  return {
    search,
    setSearch,
    title,
    options,
    isPending,
    isError,
    canCreate,
    isSaving,
    error: addError ?? createError,
    selectGroup,
    createAndAdd,
    submit,
  };
}
