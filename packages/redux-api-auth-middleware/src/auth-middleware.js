// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch, Store } from 'redux';
import type { Action, AuthMiddlewareConfig, GetState } from './types';

export default function({ header = 'Authorization' }: AuthMiddlewareConfig = {}) {
  return (store: Store<GetState, Action, Dispatch<Action>>) => {
    if (!store.getState().auth) {
      throw new Error('You must add authReducer to your store before using authMiddleware.');
    }

    return (next: Dispatch<Action>) => (action: Action) => {
      const apiCall = action[RSAA];

      if (!apiCall || typeof apiCall.headers === 'function') {
        return next(action);
      }

      const { authToken } = store.getState().auth;
      return next({
        [RSAA]: {
          ...apiCall,
          headers:
            authToken && typeof apiCall.headers !== 'function'
              ? {
                  ...apiCall.headers,
                  [header]: `Bearer ${authToken}`,
                }
              : apiCall.headers,
        },
      });
    };
  };
}
