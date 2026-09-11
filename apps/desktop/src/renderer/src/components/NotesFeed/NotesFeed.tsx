import { useMemo, useState } from 'react';

import Box from 'components/core/Box';
import Input from 'components/core/Input';
import SegmentedControl from 'components/core/SegmentedControl';

import { useGetNotes } from 'api/notes';
import { useGetSources } from 'api/sources';
import useDebouncedValue from 'hooks/useDebouncedValue';

import {
  NOTE_KIND_FILTER_ALL,
  NOTE_KIND_FILTER_OPTIONS,
  NOTES_FIRST_PAGE,
  NOTES_PAGE_SIZE,
  NOTES_SEARCH_WIDTH,
  NOTES_SORT,
  SOURCE_LOOKUP_PAGE_SIZE,
} from './NotesFeed.constants';
import { TNoteKindFilter, TNotesFeedProps, TSourceMap } from './NotesFeed.types';
import NotesTimeline from './views/NotesTimeline';

function NotesFeed({ source, noteGroup }: TNotesFeedProps) {
  const [kindFilter, setKindFilter] = useState<TNoteKindFilter>(NOTE_KIND_FILTER_ALL);
  const [search, setSearch] = useState('');
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search).trim();

  const { data, isPending, isError } = useGetNotes({
    options: {
      page: NOTES_FIRST_PAGE,
      size: NOTES_PAGE_SIZE,
      ...NOTES_SORT,
      sourceId: source?.id,
      noteGroupId: noteGroup?.id,
      kind: kindFilter === NOTE_KIND_FILTER_ALL ? undefined : kindFilter,
      search: debouncedSearch || undefined,
    },
  });
  const { data: sources } = useGetSources({
    options: { page: NOTES_FIRST_PAGE, size: SOURCE_LOOKUP_PAGE_SIZE },
    queryParams: { enabled: !source },
  });

  const sourceMap = useMemo<TSourceMap>(() => {
    if (source) {
      return { [source.id]: source };
    }

    return Object.fromEntries((sources?.content ?? []).map((item) => [item.id, item]));
  }, [source, sources]);

  function handleToggleNote(noteId: string) {
    setOpenNoteId((current) => (current === noteId ? null : noteId));
  }

  return (
    <Box gap="l">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
        <SegmentedControl
          options={NOTE_KIND_FILTER_OPTIONS}
          value={kindFilter}
          onChange={setKindFilter}
          size="small"
        />
        <Box width={NOTES_SEARCH_WIDTH}>
          <Input
            name="notes-search"
            value={search}
            onChangeText={setSearch}
            placeholder="Search highlights"
          />
        </Box>
      </Box>
      <NotesTimeline
        notes={data?.content ?? []}
        sourceMap={sourceMap}
        noteGroup={noteGroup}
        openNoteId={openNoteId}
        isPending={isPending}
        isError={isError}
        onToggleNote={handleToggleNote}
      />
    </Box>
  );
}

export default NotesFeed;
