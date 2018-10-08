// @flow
import type { Action, SetTokenAction, State } from './types';

const initialState: State = {
  token: null,
};

export const SET_TOKEN = '@tshio/redux-api-auth-middleware/SET_TOKEN';
export const CLEAR_TOKEN = '@tshio/redux-api-auth-middleware/CLEAR_TOKEN';

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

export function authReducer(state: State = initialState, action: SetTokenAction) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    case CLEAR_TOKEN:
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
}
