// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch } from 'redux';
import type { Action } from './types';
import type { ApiSelectorMiddlewareConfig, Config } from './middleware.types';
import createEndpointMiddleware from './endpoint.middleware';

function prefixEndpoint(endpoint: string | ((state: any) => string), { apiUrl, excluded }: Config) {
  if (typeof endpoint === 'function' || excluded.some(prefix => endpoint.startsWith(prefix))) {
    return endpoint;
  }

  const baseUrl = apiUrl.replace(/\/$/, '');
  const slug = endpoint.replace(/^\//, '');

  return `${baseUrl}/${slug}`;
}

export default function createApiSelectorMiddleware(config: ApiSelectorMiddlewareConfig) {
  return () => (next: Dispatch<Action>) => (action: Action) => {
    const apiCall = action[RSAA];

    if (!apiCall) {
      return next(action);
    }

    const { api = 'default', ...rest } = apiCall;

    if (api && !config.apis[api]) {
      throw new Error(`You must specify ${api} url in apis config option`);
    }

    const { apiUrl, ...apiOptions } = config.apis[api];

    const endpoint = prefixEndpoint(apiCall.endpoint, {
      apiUrl: apiUrl,
      excluded: config.excluded,
    });

    return createEndpointMiddleware(endpoint, apiOptions)(next)({
      [RSAA]: {
        ...rest,
      },
    });
  };
}
