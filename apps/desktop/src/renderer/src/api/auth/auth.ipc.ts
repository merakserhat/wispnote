import API_ENDPOINT from 'shared/constants/apiEndpoint';
import {
  TConfirmEmailRequestParams,
  TLoginRequestParams,
  TMember,
  TRegisterRequestParams,
  TRegisterResponse,
  TResendVerificationRequestParams,
  TResendVerificationResponse,
} from 'shared/types/auth.types';
import { TCommonResponse } from 'shared/types/common';

import Ipc from 'helpers/ipc';

export async function requestLogin(params: TLoginRequestParams): Promise<void> {
  await Ipc.post<null>(API_ENDPOINT.LOGIN, params);
}

export async function requestRegister(
  params: TRegisterRequestParams
): Promise<TCommonResponse<TRegisterResponse>> {
  const response = await Ipc.post<TCommonResponse<TRegisterResponse>>(
    API_ENDPOINT.REGISTER,
    params
  );
  return response.data;
}

export async function requestConfirmEmail({
  verificationToken,
  ...params
}: TConfirmEmailRequestParams): Promise<void> {
  await Ipc.post<null>(API_ENDPOINT.EMAIL_VERIFICATION_CONFIRM, params, {
    headers: { Authorization: `Bearer ${verificationToken}` },
  });
}

export async function requestResendVerification({
  verificationToken,
}: TResendVerificationRequestParams): Promise<TCommonResponse<TResendVerificationResponse>> {
  const response = await Ipc.post<TCommonResponse<TResendVerificationResponse>>(
    API_ENDPOINT.EMAIL_VERIFICATION_RESEND,
    undefined,
    { headers: { Authorization: `Bearer ${verificationToken}` } }
  );
  return response.data;
}

export async function requestMember(): Promise<TCommonResponse<TMember>> {
  const response = await Ipc.get<TCommonResponse<TMember>>(API_ENDPOINT.MEMBERS_ME);
  return response.data;
}

export async function requestSignOut(): Promise<void> {
  await window.wisp.signOut();
}
