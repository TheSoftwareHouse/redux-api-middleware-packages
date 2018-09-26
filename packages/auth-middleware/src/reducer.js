// @flow

import { SET_TOKEN, CLEAR_TOKEN } from './action-types';
import type { SetTokenAction, State } from './types';

const initialState: State = {
  token: null,
};

export default function authReducer(state: State = initialState, action: SetTokenAction) {
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
