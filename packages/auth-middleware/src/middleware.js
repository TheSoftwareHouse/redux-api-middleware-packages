// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch, Store } from 'redux';
import type { Action, GetState } from './types';

export default function authMiddleware(store: Store<GetState, Action, Dispatch<Action>>) {
  return (next: Dispatch<Action>) => (action: Action) => {
    const apiCall = action[RSAA];

    if (!apiCall || typeof apiCall.headers === 'function') {
      return next(action);
    }

    const { auth } = store.getState();
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
