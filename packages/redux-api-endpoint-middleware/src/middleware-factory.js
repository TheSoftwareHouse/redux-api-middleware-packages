// @flow

import type { Options } from './middleware.types';
import createApiSelectorMiddleware from './api-selector.middleware';

export default function endpointMiddlewareFactory(options: Options = {}) {
  if (!((options.apis && options.apis.default && options.apis.default.apiUrl) || process.env.REACT_APP_API_URL)) {
    throw new Error('You must specify API url either via options or REACT_APP_API_URL environment variable');
  }

  const defaultApi =
    options.apis && options.apis['default'] && options.apis['default'].apiUrl
      ? options.apis['default']
      : {
          apiUrl: process.env.REACT_APP_API_URL,
        };

  const config = {
    apis: {
      ...options.apis,
      default: defaultApi,
    },
    excluded: options.excluded || ['http://', 'https://'],
  };

  return createApiSelectorMiddleware(config);
}
