# Content middleware

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tsh/content-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tsh/content-middleware

Then, to enable contentMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import contentMiddleware from '@tsh/content-middleware';

import { appReducer } from 'app/app.reducer';

const middlewares = [contentMiddleware, apiMiddleware];

const store = createStore(appReducer, applyMiddleware(...middlewares));
```