# Validation middleware

## Motivation
It's not uncommon for the client to receive unexpected or invalid JSON response from the server.
 
 The goal of this middleware is to provide a convenient way to validate the received responses and allow the app to gracefully handle unexpected data and remain operational under difficult conditions.
 
 This middleware is meant to be used in JavaScript client applications utilizing Redux and redux-api-middleware libraries in both web and mobile environments (such as React Native).
 
 ## Installation
 
Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/redux-api-validation-middleware

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/redux-api-validation-middleware

In order to instantiate and configure your validation middleware a validator object is required.
Validator should conform simple interface, common for validation libraries:

```
  // pseudocode  
  interface Validator { 
    validate: (schema, object) => boolean;
    errors: any[];
  }
```

The simplest way to setup the middleware is to use [Ajv](https://github.com/epoberezkin/ajv) instance directly:

```js
import Ajv from 'ajv';
import { applyMiddleware, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import createValidationMiddleware from '@tshio/redux-api-validation-middleware';
import { appReducer } from 'app/app.reducer';

const validator = new Ajv();

const options = {
  onError: (error) => console.log(error.message),
  suppressDevWarnings: false,
}

const validationMiddleware = createValidationMiddleware(validator, options);

const middlewares = [validationMiddleware, apiMiddleware];

const store = createStore(appReducer, applyMiddleware(...middlewares));
```

## Usage

In order to validate the responses, you can provide JSON schema object to validate against for success and error action descriptors:

```js
export const FETCH_USER_REQUEST = 'users/FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'users/FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'users/FETCH_USER_FAILURE';

export const fetchUser = () => ({
  [RSAA]: {
    endpoint: '/me',
    method: 'GET',
    types: [
      FETCH_USER_REQUEST, 
      {
          type: FETCH_USER_SUCCESS,
          schema: { 
              "properties": {
                "username": {
                  "type": "string",
                },
                "id": { 
                  "type": "number" 
                },
                "roles": { 
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
           }
      }, 
      FETCH_USER_FAILURE
     ],
  },
});
``` 
In the example above, validation logic will be run on JSON returned from the server. 

If the validation passes, success action will be dispatched with the payload function result or payload object that were initially defined on action descriptor level. By default, in redux-api-middleware payload will be evaluated from ```(action, state, res) => getJSON(res)```

If the validation fails for any reason, success action with ```error: true``` and payload containing error object will be dispatched. ```onError``` will be called with the error object, if specified.

In addition, in development mode the middleware will emit warnings for the developer with messages describing what went wrong.

While this may seem confusing at first, this kind of behavior maintains consistency with redux-api-middleware, in which success actions with error property set are dispatched whenever payload resolve function fails. This can happen when, for example, default payload resolving functions fails because of invalid JSON returned from the API. 

Your app **must always** handle success action type descriptors with ```error: true``` that contain error payload whenever you are using redux-api-middleware.
Also, this behavior allows to easily distinguish response validation errors from requests completed with error codes and other failures (such as network failure).

## Configuration
Additional configuration options can be passed to ``createValidationMiddleware`` function:

| Property name         | Type              | Required | Description                                                                              |
| --------------------- | ----------------- | -------- | ---------------------------------------------------------------------------------------- |
| suppressDevWarnings   | `boolean`         | `false`  | Disable console.warn calls on validation failures during development                     |
| onError               | `(error) => void` | `false`  | Additional general purpose error callback that will be called whenever validation fails. |