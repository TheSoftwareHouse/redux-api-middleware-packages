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
import createParamsMiddleware from '@tshio/redux-api-params-middleware';

import { appReducer } from 'app/app.reducer';

const paramsMiddleware = createParamsMiddleware();

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

## Params format

Default params format is _**indices**_.

We are using stringify from [qs](https://github.com/ljharb/qs) so we can pass any options from documentation
as `defaultOptions` or `paramOptions`.

### Globally

You can change params format by using `defaultOptions` option during creation of the middleware:

```js
const paramsMiddleware = createParamsMiddleware({
  defaultOptions: {
    arrayFormat: 'repeat',
  },
});

// output 'a=b&a=c'
```

Such middleware configuration will use 'repeat' format unless some `paramOptions` are defined for particular action.

### In particular request

In case you want to override params format for particular request only
(for instance when you use multiple APIs with inconsistent format)
you can change params format by using `paramsOptions` in particular action.

```js
params: {
    a: ['b', 'c'],
}
paramsOptions: {
    arrayFormat: 'indices'
}

//  output 'a[0]=b&a[1]=c'
```

```
params: {
    a: ['b', 'c'],
}
paramsOptions: {
    arrayFormat: 'brackets' // output 'a[]=b&a[]=c'
}
```

```
params: {
    a: ['b', 'c'],
}
paramsOptions: {
    arrayFormat: 'repeat' // output 'a=b&a=c'
}
```

More information about options in stringify function [ in qs documentation.](https://github.com/ljharb/qs#stringifying)
