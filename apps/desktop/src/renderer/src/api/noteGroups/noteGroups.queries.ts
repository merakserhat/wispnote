import { TNoteGroupsFilterParams } from 'shared/types/noteGroup.types';

const noteGroupsQueryKeys = {
  all: ['noteGroups'] as const,
  list: (params: TNoteGroupsFilterParams) => [...noteGroupsQueryKeys.all, 'list', params] as const,
  detail: (noteGroupId: string) => [...noteGroupsQueryKeys.all, 'detail', noteGroupId] as const,
};

export default noteGroupsQueryKeys;
