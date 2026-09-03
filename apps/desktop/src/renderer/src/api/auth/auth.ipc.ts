import API_ENDPOINT from 'shared/constants/apiEndpoint';
import { TLoginRequestParams, TMember, TRegisterRequestParams } from 'shared/types/auth.types';
import { TCommonResponse } from 'shared/types/common';

import Ipc from 'helpers/ipc';

export async function requestLogin(params: TLoginRequestParams): Promise<void> {
  await Ipc.post<null>(API_ENDPOINT.LOGIN, params);
}

export async function requestRegister(
  params: TRegisterRequestParams
): Promise<TCommonResponse<TMember>> {
  const response = await Ipc.post<TCommonResponse<TMember>>(API_ENDPOINT.REGISTER, params);
  return response.data;
}

export async function requestMember(): Promise<TCommonResponse<TMember>> {
  const response = await Ipc.get<TCommonResponse<TMember>>(API_ENDPOINT.MEMBERS_ME);
  return response.data;
}

export async function requestSignOut(): Promise<void> {
  await window.wisp.signOut();
}
