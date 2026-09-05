import { TPaginatedResponse, TPaginationRequestParams } from './common';

export type TAutomation = {
  id: string;
  ruleText: string;
  enabled: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type TAutomationsFilterParams = {
  sortBy?: 'createdAt' | 'updatedAt';
  isAscending?: boolean;
  enabled?: boolean;
};

export type TAutomationListRequestParams = TPaginationRequestParams<TAutomationsFilterParams>;

export type TAutomationListResponse = {
  result: TPaginatedResponse<TAutomation>['result'] & {
    activeCount: number;
  };
};

export type TAutomationDetailRequestParams = {
  automationId: string;
};

export type TCreateAutomationRequestParams = {
  ruleText: string;
};

export type TUpdateAutomationRequestParams = TAutomationDetailRequestParams & {
  ruleText: string;
  enabled?: boolean;
};

export type TToggleAutomationRequestParams = TAutomationDetailRequestParams & {
  enabled: boolean;
};
