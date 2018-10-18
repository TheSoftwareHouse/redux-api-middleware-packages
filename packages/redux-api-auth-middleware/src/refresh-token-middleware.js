// @flow
import type { Dispatch, Store } from 'redux';
import { RSAA } from 'redux-api-middleware';
import isObject from 'lodash.isplainobject';

import { refreshTokenAction } from './store';
import type { Action, GetState, RefreshMiddlewareConfig } from './types';

const buffer = new Set();

export default function({
  header = 'Authorization',
  endpoint = '',
  failedAction = { type: 'LOGOUT' },
}: RefreshMiddlewareConfig = {}) {
  if (!endpoint) {
    throw new Error('You must set the endpoint for refreshing token.');
  }

  return (store: Store<GetState, Action, Dispatch<Action>>) => {
    if (!store.getState().auth) {
      throw new Error('You must add authReducer to your store before using refreshMiddleware.');
    }

    return (next: Dispatch<Action>) => (action: Action) => {
      const apiCall = action[RSAA];
      const { refreshToken } = store.getState().auth;

      if (!apiCall) {
        return next(action);
      }

      if (apiCall.headers && !!apiCall.headers[header]) {
        return next({
          [RSAA]: {
            ...apiCall,
            types: [
              apiCall.types[0],
              apiCall.types[1],
              {
                ...(isObject(apiCall.types[2]) ? apiCall.types[2] : {}),
                type: isObject(apiCall.types[2]) ? apiCall.types[2].type : apiCall.types[2],
                meta: (action, state, res) => {
                  if (401 === res.status) {
                    buffer.add(action);
                    const refreshTokenPromise = store.dispatch(
                      refreshTokenAction({ refreshToken, endpoint: endpoint })
                    );

                    if (refreshTokenPromise instanceof Promise) {
                      refreshTokenPromise.then(refreshAction => {
                        if (!refreshAction.error) {
                          const promises = [...buffer].map(action => store.dispatch(action));
                          buffer.clear();

                          return Promise.all(promises);
                        } else {
                          failedAction && store.dispatch(failedAction);
                        }
                      });
                    }
                  }
                },
              },
            ],
          },
        });
      }

      return next(action);
    };
  };
}
