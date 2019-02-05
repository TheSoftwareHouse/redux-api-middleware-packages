// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch } from 'redux';
import type { Action } from './types';

export default function createEndpointMiddleware(endpoint: string | ((state: any) => string), apiOptions: Object) {
  return (next: Dispatch<Action>) => (action: Action) => {
    const apiCall = action[RSAA];

    if (!apiCall) {
      return next(action);
    }

    return next({
      [RSAA]: {
        ...apiOptions,
        ...apiCall,
        endpoint,
      },
    });
  };
}
