import { SET_TOKEN, CLEAR_TOKEN } from './const';

export function setAuthToken(token) {
  return {
    type: SET_TOKEN,
    payload: { token },
  };
}

export function clearAuthToken(token) {
  return {
    type: CLEAR_TOKEN,
  };
}
