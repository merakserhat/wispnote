import { QueryKey } from '@tanstack/react-query';

import {
  TAutomation,
  TAutomationListResponse,
  TAutomationSuggestion,
  TToggleAutomationRequestParams,
} from 'shared/types/automation.types';

export type TRuleFormValues = {
  ruleText: string;
};

export type TRuleRowProps = {
  automation: TAutomation;
};

export type TRulesContentProps = {
  automations: TAutomation[];
  isPending: boolean;
  isError: boolean;
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
