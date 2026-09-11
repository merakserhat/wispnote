import { TNoteGroup } from 'shared/types/noteGroup.types';

export type TNoteGroupPickerProps = {
  noteId: string;
};

export type TNoteGroupPickerContentProps = {
  noteId: string;
  onDone: () => void;
};

export type TUseNoteGroupPickerParams = TNoteGroupPickerContentProps;

export type TSelectNoteGroupHandler = (group: TNoteGroup) => void;

export type TNoteGroupOptionProps = {
  group: TNoteGroup;
  disabled: boolean;
  onSelect: TSelectNoteGroupHandler;
};

export type TCreateNoteGroupOptionProps = {
  title: string;
  disabled: boolean;
  onCreate: () => void;
};
