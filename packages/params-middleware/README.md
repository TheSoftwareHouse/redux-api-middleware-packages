# Params middleware

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/params-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/params-middleware

Then, to enable paramsMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import paramsMiddleware from '@tshio/params-middleware';

import { appReducer } from 'app/app.reducer';

const middlewares = [paramsMiddleware, apiMiddleware];

const store = createStore(appReducer, applyMiddleware(...middlewares));
```