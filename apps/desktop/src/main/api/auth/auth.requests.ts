import API_ENDPOINT from 'shared/constants/apiEndpoint';
import {
  TLoginRequestParams,
  TMember,
  TRegisterRequestParams,
  TTokenResponse,
} from 'shared/types/auth.types';
import { TCommonResponse } from 'shared/types/common';

import Api from '../../helpers/api';

export async function requestLogin(
  params: TLoginRequestParams
): Promise<TCommonResponse<TTokenResponse>> {
  const response = await Api.post<TCommonResponse<TTokenResponse>>(API_ENDPOINT.LOGIN, params);
  return response.data;
}

export async function requestRegister(
  params: TRegisterRequestParams
): Promise<TCommonResponse<TMember>> {
  const response = await Api.post<TCommonResponse<TMember>>(API_ENDPOINT.REGISTER, params);
  return response.data;
}

export async function requestMember(): Promise<TCommonResponse<TMember>> {
  const response = await Api.get<TCommonResponse<TMember>>(API_ENDPOINT.MEMBERS_ME);
  return response.data;
}
