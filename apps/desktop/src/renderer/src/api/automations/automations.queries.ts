import { TAutomationListRequestParams } from 'shared/types/automation.types';

const automationsQueryKeys = {
  all: ['automations'] as const,
  lists: () => [...automationsQueryKeys.all, 'list'] as const,
  list: (params: TAutomationListRequestParams) =>
    [...automationsQueryKeys.lists(), params] as const,
  suggestions: () => [...automationsQueryKeys.all, 'suggestions'] as const,
};

export default automationsQueryKeys;
