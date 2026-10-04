import API_ENDPOINT from 'shared/constants/apiEndpoint';
import normalizeUrl from 'shared/helpers/normalizeUrl';
import {
  TAutomation,
  TAutomationDetailRequestParams,
  TAutomationListRequestParams,
  TAutomationListResponse,
  TAutomationSuggestion,
  TCreateAutomationRequestParams,
  TToggleAutomationRequestParams,
  TUpdateAutomationRequestParams,
} from 'shared/types/automation.types';
import { TCommonResponse } from 'shared/types/common';

import Ipc from 'helpers/ipc';

export async function requestAutomations({
  page,
  size = 20,
  ...filterParams
}: TAutomationListRequestParams): Promise<TAutomationListResponse> {
  const response = await Ipc.get<TAutomationListResponse>(
    normalizeUrl(API_ENDPOINT.AUTOMATIONS, {
      queryParams: { page, size, ...filterParams },
    })
  );
  return response.data;
}

export async function requestAutomationSuggestions(): Promise<
  TCommonResponse<TAutomationSuggestion[]>
> {
  const response = await Ipc.get<TCommonResponse<TAutomationSuggestion[]>>(
    API_ENDPOINT.AUTOMATION_SUGGESTIONS
  );
  return response.data;
}

export async function requestCreateAutomation(
  params: TCreateAutomationRequestParams
): Promise<TCommonResponse<TAutomation>> {
  const response = await Ipc.post<TCommonResponse<TAutomation>>(API_ENDPOINT.AUTOMATIONS, params);
  return response.data;
}

export async function requestUpdateAutomation({
  automationId,
  ...params
}: TUpdateAutomationRequestParams): Promise<TCommonResponse<TAutomation>> {
  const response = await Ipc.put<TCommonResponse<TAutomation>>(
    normalizeUrl(API_ENDPOINT.AUTOMATION_DETAIL, { pathVariables: { automationId } }),
    params
  );
  return response.data;
}

export async function requestToggleAutomation({
  automationId,
  enabled,
}: TToggleAutomationRequestParams): Promise<TCommonResponse<TAutomation>> {
  const response = await Ipc.patch<TCommonResponse<TAutomation>>(
    normalizeUrl(API_ENDPOINT.AUTOMATION_DETAIL, { pathVariables: { automationId } }),
    { enabled }
  );
  return response.data;
}

export async function requestDeleteAutomation({
  automationId,
}: TAutomationDetailRequestParams): Promise<void> {
  await Ipc.delete<void>(
    normalizeUrl(API_ENDPOINT.AUTOMATION_DETAIL, { pathVariables: { automationId } })
  );
}
