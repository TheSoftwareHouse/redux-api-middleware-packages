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
    const apiCall = action[RSAA];

    if (!apiCall) {
      return next(action);
    }

    const isJSON = isJSONLikeObject(apiCall.body);

    return next({
      [RSAA]: {
        ...apiCall,
        headers:
          isJSON && typeof apiCall.headers !== 'function'
            ? {
                ...apiCall.headers,
                'Content-Type': 'application/json',
              }
            : apiCall.headers,
        body: isJSON ? JSON.stringify(apiCall.body) : apiCall.body,
      },
    });
  };
}
