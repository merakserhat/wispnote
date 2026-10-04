import { TSourceListRequestParams } from 'shared/types/source.types';

const sourcesQueryKeys = {
  all: ['sources'] as const,
  list: (params: TSourceListRequestParams) => [...sourcesQueryKeys.all, 'list', params] as const,
};

export default sourcesQueryKeys;
