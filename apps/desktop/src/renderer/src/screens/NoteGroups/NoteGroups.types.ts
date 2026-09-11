import { TNoteGroup } from 'shared/types/noteGroup.types';

export type TNoteGroupFormValues = {
  title: string;
  description?: string;
};

export type TSelectNoteGroupHandler = (group: TNoteGroup) => void;

export type TNoteGroupsToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  onNewGroup: () => void;
};

export type TNoteGroupFormProps = {
  onClose: () => void;
};

export type TNoteGroupsContentProps = {
  search: string;
  onSelectGroup: TSelectNoteGroupHandler;
};

export type TNoteGroupCardProps = {
  group: TNoteGroup;
  onPress: TSelectNoteGroupHandler;
};

export type TNoteGroupDetailProps = {
  group: TNoteGroup;
  onBack: () => void;
};
