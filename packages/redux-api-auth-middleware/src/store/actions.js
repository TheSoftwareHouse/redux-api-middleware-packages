import { RSAA } from 'redux-api-middleware';
import { CLEAR_TOKEN, REFRESH_TOKEN_FAILURE, REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, SET_TOKEN } from './types';
import type { Action } from '../types';

export function setTokenAction({ authToken, refreshToken }: { authToken: string, refreshToken: string }): Action {
  return {
    type: SET_TOKEN,
    payload: { authToken, refreshToken },
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
