import RuleCheckState from 'enums/RuleCheckState';
import RuleMissingGroupReason from 'enums/RuleMissingGroupReason';
import { resolvePollingPhase } from 'hooks/usePolling';
import AutomationCheckRunOutcome from 'shared/enums/AutomationCheckRunOutcome';
import AutomationCheckRunStatus from 'shared/enums/AutomationCheckRunStatus';
import { TAutomationCheckRun, TAutomationListResponse } from 'shared/types/automation.types';
import { TNoteGroup } from 'shared/types/noteGroup.types';

import { RULE_ATTENTION_STATES } from './Automations.constants';
import {
  TApplyToggleToAutomationsParams,
  TResolveRuleCheckParams,
  TRuleCheck,
  TRuleCounts,
  TRuleRecheck,
  TRuleRow,
} from './Automations.types';

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

export function isCheckRunUnfinished(checkRun: TAutomationCheckRun | undefined): boolean {
  return !checkRun || checkRun.status === AutomationCheckRunStatus.IN_PROGRESS;
}

function resolveChecking(startedAt: number, now: number, previous?: TRuleCheck): TRuleCheck {
  const { isSlow, isTimedOut } = resolvePollingPhase(now - startedAt);

  if (isTimedOut) {
    return { state: RuleCheckState.COULDNT_CHECK, isSlow: false };
  }

  return {
    state: RuleCheckState.CHECKING,
    isSlow,
    startedAt,
    previous: previous?.state === RuleCheckState.CHECKING ? undefined : previous,
  };
}

function findRuleGroup(groups: TNoteGroup[], checkRun: TAutomationCheckRun) {
  const byId = groups.find((group) => group.id === checkRun.requiredGroupId);

  if (byId) {
    return byId;
  }

  const title = checkRun.requiredGroupTitle?.trim().toLowerCase();

  return title ? groups.find((group) => group.title.trim().toLowerCase() === title) : undefined;
}

function resolveCheckRun(
  checkRun: TAutomationCheckRun | undefined,
  groups: TNoteGroup[] | undefined,
  now: number,
  checkingSince: number
): TRuleCheck {
  if (!checkRun || checkRun.status === AutomationCheckRunStatus.IN_PROGRESS) {
    return resolveChecking(checkingSince, now);
  }

  if (checkRun.status === AutomationCheckRunStatus.FAILED) {
    return { state: RuleCheckState.COULDNT_CHECK, isSlow: false };
  }

  const details = checkRun.details || undefined;

  if (checkRun.outcome === AutomationCheckRunOutcome.REJECTED) {
    return { state: RuleCheckState.NEEDS_REWORDING, isSlow: false, details };
  }

  const groupTitle = checkRun.requiredGroupTitle ?? '';

  if (!groupTitle) {
    return { state: RuleCheckState.COULDNT_CHECK, isSlow: false };
  }

  if (!groups) {
    return { state: RuleCheckState.READY, isSlow: false, details, groupTitle };
  }

  const group = findRuleGroup(groups, checkRun);

  if (group) {
    return {
      state: RuleCheckState.READY,
      isSlow: false,
      details,
      group,
      groupTitle: group.title,
    };
  }

  return {
    state: RuleCheckState.NEEDS_GROUP,
    isSlow: false,
    details,
    groupTitle,
    missingGroupReason: checkRun.requiredGroupId
      ? RuleMissingGroupReason.DELETED
      : RuleMissingGroupReason.NOT_CREATED,
  };
}

export function isRecheckFresh(
  checkRun: TAutomationCheckRun | undefined,
  recheck: TRuleRecheck
): boolean {
  return Boolean(checkRun) && checkRun?.updatedAt !== recheck.previous?.updatedAt;
}

export function resolveRuleCheck({
  automation,
  groups,
  now,
  recheck,
  checkingSince = now,
}: TResolveRuleCheckParams): TRuleCheck {
  if (recheck && !isRecheckFresh(automation.checkRun, recheck)) {
    const previous = recheck.previous
      ? resolveCheckRun(recheck.previous, groups, now, checkingSince)
      : undefined;

    return resolveChecking(recheck.requestedAt, now, previous);
  }

  return resolveCheckRun(automation.checkRun, groups, now, checkingSince);
}

export function getRulesPollingAnchor(rows: TRuleRow[]): number | undefined {
  const startedAts = rows
    .filter((row) => row.check.state === RuleCheckState.CHECKING)
    .map((row) => row.check.startedAt ?? 0);

  return startedAts.length ? Math.max(...startedAts) : undefined;
}

export function countRules(rows: TRuleRow[]): TRuleCounts {
  return rows.reduce<TRuleCounts>(
    (counts, { automation, check }) => ({
      active: counts.active + (automation.enabled && check.state === RuleCheckState.READY ? 1 : 0),
      attention: counts.attention + (RULE_ATTENTION_STATES.includes(check.state) ? 1 : 0),
    }),
    { active: 0, attention: 0 }
  );
}

export function formatAttentionCount(count: number): string {
  return `${count} need${count === 1 ? 's' : ''} attention`;
}
