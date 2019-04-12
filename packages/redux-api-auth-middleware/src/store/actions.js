import { RSAA } from 'redux-api-middleware';
import { CLEAR_TOKEN, REFRESH_TOKEN_FAILURE, REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, SET_TOKEN } from './types';
import type { Action } from '../types';

export function setTokenAction({
  access_token,
  refresh_token,
  expires_in,
}: {
  access_token: string,
  refresh_token?: string,
  expires_in?: number,
}): Action {
  return {
    type: SET_TOKEN,
    payload: { access_token, refresh_token, expires_in },
  };
}

export function refreshTokenAction({ refreshToken, endpoint }: { refreshToken: string, endpoint: string }): Action {
  return {
    [RSAA]: {
      types: [REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE],
      endpoint,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: refreshToken,
      }),
      skipAuth: true,
    },
  };
}

export function clearTokenAction(): Action {
  return {
    type: CLEAR_TOKEN,
  };
}
