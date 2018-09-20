// @flow

import { RSAA } from 'redux-api-middleware';
import isPlainObject from 'lodash.isplainobject';

import type { Dispatch } from 'redux';
import type { Action } from './types';

function isJSONLikeObject(value: any): boolean {
  return isPlainObject(value) || Array.isArray(value);
}

export default function contentMiddleware() {
  return (next: Dispatch<Action>) => (action: Action) => {
    const apiMiddleware = action[RSAA];

    if (!apiMiddleware) {
      return next(action);
    }

    const isJSON = isJSONLikeObject(apiMiddleware.body);

    return next({
      [RSAA]: {
        ...apiMiddleware,
        headers:
          isJSON && typeof apiMiddleware.headers !== 'function'
            ? {
                ...apiMiddleware.headers,
                'Content-Type': 'application/json',
              }
            : apiMiddleware.headers,
        body: isJSON ? JSON.stringify(apiMiddleware.body) : apiMiddleware.body,
      },
    });
  };
}
