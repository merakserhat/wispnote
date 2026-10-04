export type TNoteGroup = {
  id: string;
  title: string;
  description: string | null;
  noteCount: number;
};

export type TNoteGroupsFilterParams = {
  search?: string;
};

export type TCreateNoteGroupRequestParams = {
  title: string;
  description?: string;
};

export type TNoteGroupDetailRequestParams = {
  noteGroupId: string;
};

export type TNoteGroupMembershipRequestParams = TNoteGroupDetailRequestParams & {
  noteId: string;
};
