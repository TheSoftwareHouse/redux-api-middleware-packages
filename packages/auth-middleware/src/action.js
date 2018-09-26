// @flow

import { SET_TOKEN, CLEAR_TOKEN } from './action-types';
import type { Action } from './types';

export function setAuthToken(token: string): Action {
  return {
    type: SET_TOKEN,
    payload: { token },
  };
}

export function clearAuthToken(): Action {
  return {
    type: CLEAR_TOKEN,
  };
}
