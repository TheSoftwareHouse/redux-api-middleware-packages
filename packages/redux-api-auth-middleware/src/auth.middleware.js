// @flow
import type { Dispatch, Store } from 'redux';
import { RSAA } from 'redux-api-middleware';

import { refreshTokenAction } from './store/actions';
import type { Action, GetState, MiddlewareConfig } from './types';
import { isTokenExpired } from './helpers';

let refreshPromise: Promise<any> | null = null;

export default function({
  authConfig = { header: 'Authorization', type: 'Bearer' },
  refreshConfig,
}: MiddlewareConfig = {}) {
  if (refreshConfig && !refreshConfig.endpoint) {
    throw new Error('You must set the endpoint for refreshing token.');
  }

  return (store: Store<GetState, Action, Dispatch<Action>>) => {
    if (!store.getState().auth) {
      throw new Error('You must add authReducer to your store before using refreshMiddleware.');
    }

    return (next: Dispatch<Action>) => (action: Action) => {
      const apiCall = action[RSAA];
      const nextAuth = action => {
        return next({
          [RSAA]: {
            ...action[RSAA],
            headers:
              typeof action[RSAA].headers !== 'function'
                ? {
                    ...action[RSAA].headers,
                    [authConfig.header]: `${authConfig.type} ${store.getState().auth.authToken}`,
                  }
                : action[RSAA].headers,
          },
        });
      };

      if (apiCall) {
        if (apiCall.skipAuth) {
          delete apiCall.skipAuth;
          return next(action);
        }

        const { authToken, refreshToken, expires } = store.getState().auth;

        if (authToken) {
          if (refreshConfig && isTokenExpired(expires)) {
            if (!refreshPromise) {
              refreshPromise = store
                .dispatch(refreshTokenAction({ refreshToken: refreshToken, endpoint: refreshConfig.endpoint }))
                .then(apiCall => {
                  refreshPromise = null;
                  return apiCall;
                });
            }

            if (refreshPromise) {
              return refreshPromise.then(apiCall => {
                if (apiCall.error) {
                  return store.dispatch(refreshConfig.failedAction);
                }
                return nextAuth(action);
              });
            }
          }
          return nextAuth(action);
        }
      }
      return next(action);
    };
  };
}
