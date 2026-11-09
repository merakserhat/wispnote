import { ReactNode } from 'react';
import { QueryKey } from '@tanstack/react-query';

import RuleCheckState from 'enums/RuleCheckState';
import RuleMissingGroupReason from 'enums/RuleMissingGroupReason';
import {
  TAutomation,
  TAutomationCheckRun,
  TAutomationListResponse,
  TAutomationSuggestion,
  TToggleAutomationRequestParams,
} from 'shared/types/automation.types';
import { TNoteGroup } from 'shared/types/noteGroup.types';

export type TRuleFormValues = {
  ruleText: string;
};

export type TRuleCheck = {
  state: RuleCheckState;
  isSlow: boolean;
  startedAt?: number;
  details?: string;
  group?: TNoteGroup;
  groupTitle?: string;
  missingGroupReason?: RuleMissingGroupReason;
  previous?: TRuleCheck;
};

export type TRuleRecheck = {
  requestedAt: number;
  previous?: TAutomationCheckRun;
};

export type TRuleRecheckMap = Record<string, TRuleRecheck>;

export type TRuleCheckingSinceMap = Record<string, number>;

export type TResolveRuleCheckParams = {
  automation: TAutomation;
  groups?: TNoteGroup[];
  now: number;
  recheck?: TRuleRecheck;
  checkingSince?: number;
};

export type TRuleRow = {
  automation: TAutomation;
  check: TRuleCheck;
};

export type TRuleCounts = {
  active: number;
  attention: number;
};

export type TRecheckHandler = (automationId: string, previous?: TAutomationCheckRun) => void;

export type TRuleRowProps = TRuleRow & {
  onRecheck: TRecheckHandler;
};

export type TRulesContentProps = {
  rows: TRuleRow[];
  isPending: boolean;
  isError: boolean;
  onRecheck: TRecheckHandler;
};

export type TRuleReadingProps = {
  check: TRuleCheck;
};

export type TRuleStateIconProps = {
  state: RuleCheckState;
};

export type TRuleGroupChipProps = {
  group?: TNoteGroup;
  title: string;
  missing: boolean;
};

export type TRuleEditorProps = {
  automation: TAutomation;
  onClose: () => void;
  onSaved: () => void;
  children?: ReactNode;
};

export type TRuleRowRootStyleProps = {
  $highlight: boolean;
};

export type TAutomationListSnapshot = Array<[QueryKey, TAutomationListResponse | undefined]>;

export type TApplyToggleToAutomationsParams = TToggleAutomationRequestParams & {
  response?: TAutomationListResponse;
};

export type TSelectSuggestionHandler = (suggestion: TAutomationSuggestion) => void;

export type TSuggestionChipsProps = {
  onSelect: TSelectSuggestionHandler;
};

export type TSuggestionChipProps = {
  suggestion: TAutomationSuggestion;
  onSelect: TSelectSuggestionHandler;
};
