// @flow
import { RSAA } from 'redux-api-middleware';
import type { Action, SetTokenAction, State } from './types';

const initialState: State = {
  authToken: null,
  refreshToken: null,
  isRefreshing: false,
};

export const SET_TOKEN = '@tshio/redux-api-auth-middleware/SET_TOKEN';
export const CLEAR_TOKEN = '@tshio/redux-api-auth-middleware/CLEAR_TOKEN';
export const REFRESH_TOKEN_REQUEST = '@tshio/redux-api-auth-middleware/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = '@tshio/redux-api-auth-middleware/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = '@tshio/redux-api-auth-middleware/REFRESH_TOKEN_FAILURE';

export function setToken({ authToken, refreshToken }: { authToken: string, refreshToken: string }): Action {
  return {
    type: SET_TOKEN,
    payload: { authToken, refreshToken },
  };
}

export const refreshTokenAction = ({ refreshToken, endpoint }: { refreshToken: string, endpoint: string }): Action => ({
  [RSAA]: {
    types: [REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE],
    endpoint,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: refreshToken,
    }),
  },
});

export function clearToken(): Action {
  return {
    type: CLEAR_TOKEN,
  };
}

export function authReducer(state: State = initialState, action: SetTokenAction) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        authToken: action.payload.authToken,
        refreshToken: action.payload.refreshToken,
      };
    case CLEAR_TOKEN:
      return {
        ...state,
        authToken: null,
        refreshToken: null,
      };
    case REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        isRefreshing: true,
      };
    case REFRESH_TOKEN_FAILURE:
      return {
        ...state,
        authToken: null,
        refreshToken: null,
        isRefreshing: false,
      };
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        authToken: action.payload.authToken,
        refreshToken: action.payload.refreshToken,
        isRefreshing: false,
      };
    default:
      return state;
  }
}
