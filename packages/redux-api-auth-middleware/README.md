# Redux API Auth Middleware

This little tool will help you work with request authorization and token renewal.

Use it to add **Authentication header** to your API requests and/or refresh your expired JWT/OAuth/custom tokens.

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/redux-api-auth-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/redux-api-auth-middleware

Then, to enable authMiddleware, use [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware):

```js
import { applyMiddleware, createStore } from 'redux';

import { apiMiddleware } from 'redux-api-middleware';
import { createAuthMiddleware } from '@tshio/redux-api-auth-middleware';

import { appReducer } from 'app/app.reducer'; // your main reducer

// See config details below.
const authMiddleware = createAuthMiddleware({
  authConfig: {
    header: 'Authorization',
    type: 'Bearer',
  },
  refreshConfig: {
    endpoint: '/refresh-token',
    failedAction: { type: 'LOGOUT' },
  }
});
const middlewares = [authMiddleware, apiMiddleware];
const store = createStore(appReducer, applyMiddleware(...middlewares));
```

and add authReducer to your app:

```js
import { combineReducers } from 'redux'
import { authReducer } from '@tshio/redux-api-auth-middleware';

// See config details below.
const authReducer = createAuthReducer({
  getExpirationTimestamp: payload => payload.expiration,
});

export default combineReducers({
  auth: authReducer,
  ... // rest of your reducers
})
```

## Usage
To use this middleware you have to save your `authToken` and `refreshToken` using `setTokenAction`.

```js
import { setTokenAction } from '@tshio/redux-api-auth-middleware';
import Component from './component';

const mapDispatchToProps = dispatch => ({
  onSignIn: ({authToken, refreshToken}) => dispatch(setTokenAction({ authToken, refreshToken }));
}

export default connect(
  null,
  mapDispatchToProps,
)(Component);
```

After that all you need to do is to dispatch an RSAA action, like the one below.

```js
import { RSAA } from 'redux-api-middleware';

[RSAA]: {
  types: ['GET_USERS_API_REQUEST', 'GET_USERS_API_SUCCESS', 'GET_USERS_API_FAILURE'],
  endpoint: '/users',
  method: 'GET',
},
```

If for some reason you want to skip the middleware you have to add `skipAuth` key to your action.
```js
import { RSAA } from 'redux-api-middleware';

[RSAA]: {
  types: ['LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
  endpoint: '/auth/login',
  method: 'POST',
  body: {
    username: 'foo@bar.com',
    pass: 'terces',
  },
  skipAuth: true,
},
```

To clear the token use `clearTokenAction`.

```js
import { clearTokenAction } from '@tshio/redux-api-auth-middleware';
import Component from './component';

const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(clearTokenAction());
}

export default connect(
  null,
  mapDispatchToProps,
)(Component);
```


## Configuration

### Auth middleware
|Key|Option name|Default value|Type|Role|
|--- |--- |--- |--- |--- |
|authConfig|-|-|-|Configuration for adding authorization headers|
||header|Authorization|`string`|Name of the header passed to every request that needs authorization|
||type|Bearer|`string`|Type of the token|
|refreshConfig|-|-|-|Configuration for token refresh|
||endpoint|undefined|`string`|API endpoint for token renewal|
||failedAction|undefined|`ReduxAction`|Action that will be dispatched after failed token request|

### Auth reducer
|Option name|Default value|Type|Role|
|--- |--- |--- |--- |
|getExpirationTimestamp|calculateJWTTokenExpirationDate|`function<number>`|Function returning expiration timestamp for requested token. Defaults to a function that sums `iat` and `exp` keys from JWT payload|

There are two built in functions for calculating token expiration timestamp, one for **JWT** and the other one for **OAuth2**. See examples below.

#### JWT Example
Function takes payload below, parses the `authToken` and looks for `iat` and `exp` keys to sum them. If they are not there it returns 0.

API Payload
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjQxMzM5ODA3OTksImV4cCI6MzYwMH0.XzogySsPK2_KU4uceVR1rwwKa31_5Ur9zhqCaBYVzUw",
  "refreshToken": "..."
}
```
Reducer Configuration
```js
import { calculateJWTTokenExpirationDate } from '@tshio/redux-api-auth-middleware'

const authReducer = createAuthReducer({
  getExpirationTimestamp: calculateJWTTokenExpirationDate,
});
```
#### OAuth2 Example
Function takes payload below and adds `expires_in` value to current timestamp.

API Payload
```json
{
  "access_token":"MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3",
  "token_type":"bearer",
  "expires_in":3600,
  "refresh_token":"IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk",
  "scope":"create"
}
```
Reducer Configuration
```js
import { calculateOauthTokenExpirationDate } from '@tshio/redux-api-auth-middleware'

const authReducer = createAuthReducer({
  getExpirationTimestamp: calculateOauthTokenExpirationDate,
});
```
