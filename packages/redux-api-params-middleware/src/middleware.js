// @flow

import { RSAA } from 'redux-api-middleware';
import { parse, stringify } from 'qs';

import type { Dispatch } from 'redux';
import type { Action } from './types';
import type { StringifyOptions } from 'qs';
import type { Options } from './middleware.types';

function parametriseEndpoint(endpoint, params, options: StringifyOptions) {
  const [pure, query = ''] = endpoint.split('?');

  return (
    pure +
    '?' +
    stringify(
      {
        ...parse(query),
        ...params,
      },
      options,
    )
  );
}

export default function paramsMiddlewareFactory(options?: Options = { defaultOptions: { arrayFormat: 'indices' } }) {
  function paramsMiddleware() {
    return (next: Dispatch<Action>) => (action: Action) => {
      const apiCall = action[RSAA];

      if (!apiCall || !apiCall.params || typeof apiCall.endpoint === 'function') {
        return next(action);
      }

      const { endpoint, params, paramsOptions, ...rest } = apiCall;

      return next({
        [RSAA]: {
          ...rest,
          endpoint: parametriseEndpoint(endpoint, params, paramsOptions || options.defaultOptions),
        },
      });
    };
  }

  return paramsMiddleware;
}
