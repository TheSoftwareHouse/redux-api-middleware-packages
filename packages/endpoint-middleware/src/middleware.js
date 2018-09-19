// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch } from 'redux';
import type { Action } from './types';
import type { Config, Options } from './middleware.types';

function prefixEndpoint(endpoint: string | ((state: any) => string), { apiUrl, excluded }: Config) {
  if (typeof endpoint === 'function' || excluded.some(prefix => endpoint.startsWith(prefix))) {
    return endpoint;
  }

  return apiUrl + endpoint;
}

export default function endpointMiddlewareFactory(options: Options = {}) {
  if (!(options.apiUrl || process.env.REACT_APP_API_URL)) {
    throw new Error('You must specify API url either via options or REACT_APP_API_URL environment variable');
  }

  const config: Config = {
    apiUrl: options.apiUrl || ((process.env.REACT_APP_API_URL: any): string),
    excluded: options.excluded || ['http://', 'https://'],
  };

  function endpointMiddleware() {
    return (next: Dispatch<Action>) => (action: Action) => {
      const apiMiddleware = action[RSAA];

      if (!apiMiddleware) {
        return next(action);
      }

      return next({
        [RSAA]: {
          ...apiMiddleware,
          endpoint: prefixEndpoint(apiMiddleware.endpoint, config),
        },
      });
    };
  }

  return endpointMiddleware;
}
