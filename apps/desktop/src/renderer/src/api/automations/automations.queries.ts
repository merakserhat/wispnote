import { TAutomationListRequestParams } from 'shared/types/automation.types';

const automationsQueryKeys = {
  all: ['automations'] as const,
  list: (params: TAutomationListRequestParams) =>
    [...automationsQueryKeys.all, 'list', params] as const,
};

export default automationsQueryKeys;
