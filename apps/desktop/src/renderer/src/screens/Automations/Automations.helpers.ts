import { TAutomationListResponse } from 'shared/types/automation.types';

import { TApplyToggleToAutomationsParams } from './Automations.types';

export function applyToggleToAutomations({
  response,
  automationId,
  enabled,
}: TApplyToggleToAutomationsParams): TAutomationListResponse | undefined {
  if (!response) {
    return response;
  }

  const target = response.result.content.find((automation) => automation.id === automationId);

  if (!target || target.enabled === enabled) {
    return response;
  }

  return {
    result: {
      ...response.result,
      activeCount: response.result.activeCount + (enabled ? 1 : -1),
      content: response.result.content.map((automation) =>
        automation.id === automationId ? { ...automation, enabled } : automation
      ),
    },
  };
}
