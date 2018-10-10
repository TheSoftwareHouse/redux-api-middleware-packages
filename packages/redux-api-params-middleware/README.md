# Params middleware

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/redux-api-params-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/redux-api-params-middleware

Then, to enable paramsMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import paramsMiddleware from '@tshio/redux-api-params-middleware';

import { appReducer } from 'app/app.reducer';

const middlewares = [paramsMiddleware, apiMiddleware];

const store = createStore(appReducer, applyMiddleware(...middlewares));
```

## Usage example

In order to add query params to the endpoint of the RSAA we have to add the `params` property on the same level as `endpoint`.

```js
export const FETCH_USERS_REQUEST = 'users/FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'users/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'users/FETCH_USERS_FAILURE';

export const fetchUsers = () => ({
  [RSAA]: {
    endpoint: '/users?scope=email',
    method: 'GET',
    types: [FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE],
    params: {
      ids: [1, 2, 3],
    },
  },
});
```
