// @flow

import { RSAA } from 'redux-api-middleware';
import { parse, stringify } from 'qs';

import type { Dispatch } from 'redux';
import type { Action } from './types';

function parametriseEndpoint(endpoint, params) {
  const [pure, query = ''] = endpoint.split('?');

  return (
    pure +
    '?' +
    stringify({
      ...parse(query),
      ...params,
    })
  );
}

export default function paramsMiddleware() {
  return (next: Dispatch<Action>) => (action: Action) => {
    const apiCall = action[RSAA];

    if (!apiCall || !apiCall.params || typeof apiCall.endpoint === 'function') {
      return next(action);
    }

    const { endpoint, params, ...rest } = apiCall;

    return next({
      [RSAA]: {
        ...rest,
        endpoint: parametriseEndpoint(endpoint, params),
      },
    });
  };
}
