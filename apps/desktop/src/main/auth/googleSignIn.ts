import { createHash, randomBytes } from 'node:crypto';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { shell } from 'electron';

import API_ENDPOINT from 'shared/constants/apiEndpoint';
import { TGoogleLoginRequestParams } from 'shared/types/auth.types';
import { TErrorResponse } from 'shared/types/common';
import { TIpcResponse } from 'shared/types/ipc.types';

import { GOOGLE_CLIENT_ID } from '../constants/environment';
import { log } from '../helpers';
import Api from '../helpers/api';
import { toErrorResponse } from '../ipc/ipc.helpers';
import {
  CALLBACK_HOST,
  CALLBACK_PATH,
  CALLBACK_TIMEOUT_MS,
  CANCELLED_ERROR,
  DENIED_ERROR,
  FAILURE_PAGE,
  GOOGLE_AUTH_URL,
  GOOGLE_SCOPES,
  NOT_CONFIGURED_ERROR,
  SUCCESS_PAGE,
  TIMED_OUT_ERROR,
} from './googleSignIn.constants';
import { TActiveFlow, TGoogleCallback } from './googleSignIn.types';

let activeFlow: TActiveFlow | null = null;

function closeActiveFlow(): void {
  if (!activeFlow) {
    return;
  }

  clearTimeout(activeFlow.timer);
  activeFlow.server.closeAllConnections();
  activeFlow.server.close();
  activeFlow = null;
}

function buildAuthUrl(redirectUri: string, state: string, codeChallenge: string): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', GOOGLE_SCOPES);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);
  url.searchParams.set('prompt', 'select_account');
  url.searchParams.set('access_type', 'online');
  return url.toString();
}

function respond(response: ServerResponse, status: number, body: string): void {
  response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(body);
}

function waitForCallback(state: string, codeChallenge: string): Promise<TGoogleCallback> {
  return new Promise((resolve, reject) => {
    let redirectUri = '';

    const server = createServer((request: IncomingMessage, response: ServerResponse) => {
      const url = new URL(request.url ?? '/', `http://${CALLBACK_HOST}`);

      // a reloaded old tab must not touch a newer flow
      if (activeFlow?.server !== server || url.pathname !== CALLBACK_PATH) {
        respond(response, 404, '');
        return;
      }

      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');

      if (!code || returnedState !== state) {
        respond(response, 400, FAILURE_PAGE);
        log(
          'auth',
          `google callback rejected: ${url.searchParams.get('error') ?? 'state mismatch'}`
        );
        closeActiveFlow();
        reject(DENIED_ERROR);
        return;
      }

      respond(response, 200, SUCCESS_PAGE);
      closeActiveFlow();
      resolve({ code, redirectUri });
    });

    server.on('error', (error) => {
      log('error', `google callback server failed: ${error.message}`);

      // only tear down our own flow
      if (activeFlow?.server === server) {
        closeActiveFlow();
      } else {
        server.close();
      }

      reject(DENIED_ERROR);
    });

    server.listen(0, CALLBACK_HOST, () => {
      const { port } = server.address() as AddressInfo;
      redirectUri = `http://${CALLBACK_HOST}:${port}${CALLBACK_PATH}`;

      const timer = setTimeout(() => {
        log('auth', 'google sign-in timed out');
        closeActiveFlow();
        reject(TIMED_OUT_ERROR);
      }, CALLBACK_TIMEOUT_MS);

      activeFlow = { server, timer, reject };

      log('auth', `google sign-in waiting on ${redirectUri}`);
      shell.openExternal(buildAuthUrl(redirectUri, state, codeChallenge)).catch((error: Error) => {
        log('error', `google sign-in could not open the browser: ${error.message}`);

        // a cancel may already have replaced us
        if (activeFlow?.server === server) {
          closeActiveFlow();
        }

        reject(DENIED_ERROR);
      });
    });
  });
}

export function cancelGoogleSignIn(): void {
  if (!activeFlow) {
    return;
  }

  const { reject } = activeFlow;
  closeActiveFlow();
  log('auth', 'google sign-in cancelled');
  reject(CANCELLED_ERROR);
}

export async function startGoogleSignIn(): Promise<TIpcResponse<null>> {
  if (!GOOGLE_CLIENT_ID) {
    return { ok: false, error: NOT_CONFIGURED_ERROR };
  }

  cancelGoogleSignIn();

  const state = randomBytes(32).toString('base64url');
  const codeVerifier = randomBytes(64).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

  let callback: TGoogleCallback;

  try {
    callback = await waitForCallback(state, codeChallenge);
  } catch (error) {
    return { ok: false, error: error as TErrorResponse };
  }

  const params: TGoogleLoginRequestParams = {
    code: callback.code,
    codeVerifier,
    redirectUri: callback.redirectUri,
  };

  try {
    await Api.post(API_ENDPOINT.LOGIN_GOOGLE, params);
    log('auth', 'google sign-in completed');
    return { ok: true, data: null };
  } catch (error) {
    const failure = toErrorResponse(error);
    log('auth', `google sign-in rejected by backend: ${failure.status}`);
    return { ok: false, error: failure };
  }
}
