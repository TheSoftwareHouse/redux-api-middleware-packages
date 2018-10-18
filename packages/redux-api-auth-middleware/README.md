# Auth middleware

This middleware will help you with authorization using JWT. After obtaining the token it will help you by adding it to the headers sent using `redux-api-middleware`. It will also help you refresh your token before it become expired (if token has an expire date specified).

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/redux-api-auth-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/redux-api-auth-middleware

Then, to enable authMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import { createAuthMiddleware, createRefreshTokenMiddleware } from '@tshio/redux-api-auth-middleware';

import { appReducer } from 'app/app.reducer';

const authMiddleware = createAuthMiddleware({
  header: 'Authorization',
});
const refreshTokenMiddleware = createRefreshTokenMiddleware({
  header: 'Authorization',
  endpoint: '/refresh-token',
  statusCodes: 401, // number or array, e.g. [401, 400]
  failedAction: { type: 'LOGOUT' },
});
const middlewares = [authMiddleware, refreshTokenMiddleware, apiMiddleware];
const store = createStore(appReducer, applyMiddleware(...middlewares));
```

and add authReducer to your app:

```js
import { combineReducers } from 'redux'
import { authReducer } from '@tshio/redux-api-auth-middleware';

export default combineReducers({
  auth: authReducer,
  ...
})
```
