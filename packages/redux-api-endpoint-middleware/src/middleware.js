// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch } from 'redux';
import type { Action } from './types';
import type { Config, Options } from './middleware.types';

function prefixEndpoint(
  endpoint: string | ((state: any) => string),
  { apiUrl, excluded }: Config,
  additionalApiUrl?: string,
) {
  if (typeof endpoint === 'function' || excluded.some(prefix => endpoint.startsWith(prefix))) {
    return endpoint;
  }

  const baseUrl = (additionalApiUrl || apiUrl).replace(/\/$/, '');
  const slug = endpoint.replace(/^\//, '');

  return `${baseUrl}/${slug}`;
}

export default function endpointMiddlewareFactory(options: Options = {}) {
  if (!((options.apis && options.apis.default && options.apis.default.apiUrl) || process.env.REACT_APP_API_URL)) {
    throw new Error('You must specify API url either via options or REACT_APP_API_URL environment variable');
  }

  const config: Config = {
    apiUrl:
      options.apis && options.apis.default && options.apis.default.apiUrl
        ? options.apis.default.apiUrl
        : ((process.env.REACT_APP_API_URL: any): string),
    excluded: options.excluded || ['http://', 'https://'],
  };

  function endpointMiddleware() {
    return (next: Dispatch<Action>) => (action: Action) => {
      const apiCall = action[RSAA];

      if (!apiCall) {
        return next(action);
      }

      const { api, ...rest } = apiCall;

      if (api && (!options.apis || !options.apis[api])) {
        throw new Error(`You must specify ${api} url in apis config option`);
      }

      const { apiUrl, ...apiOptions } = api && options.apis ? options.apis[api] : {};

      return next({
        [RSAA]: {
          ...apiOptions,
          ...rest,
          endpoint: prefixEndpoint(apiCall.endpoint, config, apiUrl),
        },
      });
    };
  }

  return endpointMiddleware;
}
