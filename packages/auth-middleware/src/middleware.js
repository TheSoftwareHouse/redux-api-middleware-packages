// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch, Store } from 'redux';
import type { Action, GetState } from './types';

export function authMiddleware(store: Store<GetState, Action, Dispatch<Action>>) {
  const { auth } = store.getState();

  if (!auth) {
    throw new Error('You must add authReducer to your store before using authMiddleware.');
  }

  return (next: Dispatch<Action>) => (action: Action) => {
    const apiCall = action[RSAA];

    if (!apiCall || typeof apiCall.headers === 'function') {
      return next(action);
    }

    const token = auth?.token;
    return next({
      [RSAA]: {
        ...apiCall,
        headers:
          token && typeof apiCall.headers !== 'function'
            ? {
                ...apiCall.headers,
                Authorization: `Bearer ${token}`,
              }
            : apiCall.headers,
      },
    });
  };
}
