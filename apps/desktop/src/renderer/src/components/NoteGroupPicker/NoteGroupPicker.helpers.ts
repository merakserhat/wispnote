import { TNoteGroup } from 'shared/types/noteGroup.types';

export function filterNoteGroups(groups: TNoteGroup[], search: string): TNoteGroup[] {
  const needle = search.trim().toLowerCase();

  if (!needle) {
    return groups;
  }

  return groups.filter(
    ({ title, description }) =>
      title.toLowerCase().includes(needle) || (description ?? '').toLowerCase().includes(needle)
  );
}

export function hasNoteGroupTitle(groups: TNoteGroup[], title: string): boolean {
  const needle = title.trim().toLowerCase();

  return groups.some((group) => group.title.toLowerCase() === needle);
}

export function formatNoMatch(search: string): string {
  return `No group matches “${search.trim()}”`;
}
