# Endpoint middleware

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/redux-api-endpoint-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/redux-api-endpoint-middleware

Then, to enable endpointMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import createEndpointMiddleware from '@tshio/redux-api-endpoint-middleware';

import { appReducer } from 'app/app.reducer';

const endpointMiddleware = createEndpointMiddleware();

const middlewares = [endpointMiddleware, apiMiddleware];

const store = createStore(appReducer, applyMiddleware(...middlewares));
```

## Configuration

By default all endpoints will be prefixed with the API url take from environment variable `REACT_APP_API_URL`.
In order to change it, the configuration object with property `apis.default.apiUrl` has to be passed to the endpointMiddleware
factory:

```js
const endpointMiddleware = createEndpointMiddleware({
  apis: {
    default: {
      apiUrl: process.env.MY_API,
    },
  },
});
```

Endpoints starting with `http://` and `https://` won't be prefixed. In order to change the list of the prefixes that
should be excluded the configuration object should have property `excluded` with desired list:

```js
const endpointMiddleware = createEndpointMiddleware({
  excluded: ['http://', 'https://', '/i18n/'],
});
```

When you have to connect to more than one API in your application, you can define a list of APIs (with URL and custom params) in configuration:

```js
const endpointMiddleware = createEndpointMiddleware({
  apis: {
    default: {
      apiUrl: process.env.MY_API,
      headers: {
        'X-Api-Version': '1',
      },
    },
    microServiceOne: {
      apiUrl: 'http://microservice-1.example.com',
      customParam: {
        foo: 'bar',
      },
    },
    microServiceTwo: {
      apiUrl: 'http://microservice-2.example.com',
      customParam: {
        foo: 'bar',
      },
    },
  },
});
```

and then you can select defined API directly in action (by **api** property):

```js
export const fetchUsers = () => ({
  [RSAA]: {
    method: 'GET',
    types: [FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE],
    api: 'microServiceOne',
  },
});
```

It will be equal to:

```js
export const fetchUsers = () => ({
  [RSAA]: {
    method: 'GET',
    types: [FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE],
    endpoint: 'http://microservice-1.example.com/',
    customParam: {
      foo: 'bar',
    },
  },
});
```
