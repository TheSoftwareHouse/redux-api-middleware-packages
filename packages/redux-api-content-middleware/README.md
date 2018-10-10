# Content middleware

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/redux-api-content-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/redux-api-content-middleware

Then, to enable contentMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import contentMiddleware from '@tshio/redux-api-content-middleware';

import { appReducer } from 'app/app.reducer';

const middlewares = [contentMiddleware, apiMiddleware];

const store = createStore(appReducer, applyMiddleware(...middlewares));
```
