# Authorization

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/react-router-permissions

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/react-router-permissions

## Usage

Goal of this package is to provide abstraction layer for handling authorization with react-router.
The only requirement for `AuthorizedRoute` to work is to have any kind `Router` and at least one `PermissionsProvider`
higher in your component tree.

```js
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

const store = createStore(state => ({ ...state }), {
  authorization: {
    roles: ['USER', 'ADMIN'],
  },
});

const authorizationStrategy = (roles, requirement) => {
  return roles.find(role => role === requirement);
};

// it's possible to override strategy for single route
const loginAuthorizationStrategy = (roles, requirement) => {
  return roles && roles.length;
};

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PermissionsProvider
          permissions={store.getState().authorization.roles}
          authorizationStrategy={permissionsStrategy}
        >
          <BrowserRouter>
            <Switch>
              <AuthorizedRoute path="/login" authorizationStrategy={loginAuthorizationStrategy}>
                {({ isAuthorized }) => (isAuthorized ? <Login /> : <Redirect to="/home" />)}
              </AuthorizedRoute>
              <Route path="/home" component={Home} />
              <AuthorizedRoute path="/users" requires="ADMIN">
                {({ isAuthorized }) => (isAuthorized ? <Users /> : <Redirect to="/home" />)}
              </AuthorizedRoute>
            </Switch>
          </BrowserRouter>
        </PermissionsProvider>
      </Provider>
    );
  }
}
```

`authorizationStrategy` is a function that gets called each time user either tries to access authorized content. It is called
with `permissions` passed to `PermissionsProvider` as first argument and `requirement` passed to `AuthorizedRoute` as second.
It's result is stored in isAuthorized property on ChildrenAsFunction Function used by `AuthorizedRoute`.

User is not bound to using role base authorization strategies. To showcase that we would need to make following changes to our example:

```js
const store = createStore(
  state => ({...state}), {
    authorization: {
      permissions: {
        "access-home": true,
        "access-users-list": false,
      },
     }
  });

const authorizationStrategy = (permissions, requirement) => {
  return permissions[requirement];
};

...
<PermissionsProvider
  permissions={store.getState().authorization.permissions}
  authorizationStrategy={permissionsStrategy}
>

...

<AuthorizedRoute
  path='/users'
  requires='access-users-list'
>
```

There are some strategies provided with the package out of the box. Those are:

- Role based strategy

  ```js
  const permissions = ['MODERATOR', 'PREMIUM_USER'];

  ...
  // authorization will pass
  <AuthorizedRoute
    path='/authorized-section'
    requires='MODERATOR'
  >
  ...

  ...
  // authorization will fail
  <AuthorizedRoute
    path='/authorized-section'
    requires='ADMIN'
  >
  ...
  ```

* Permissions based strategy

  ```js
  const permissions = {
    canReadPosts: true,
    canManagePosts: true,
    canManageUsers: false,
  };

  ...
  // authorization will pass
  <AuthorizedRoute
    path='/authorized-section'
    requires='canManagePosts'
  >
  ...

  ...
  // authorization will fail
  <AuthorizedRoute
    path='/authorized-section'
    requires='canManageUsers'
  >
  ...
  ```

* At least one strategy

  ```js
  const permissions = {
    canReadPosts: true,
    canManagePosts: false,
    canManageUsers: false,
    canViewUsers: false,
  };

  ...
  // authorization will pass
  <AuthorizedRoute
    path='/authorized-section'
    requires={['canReadPosts', 'canManagePosts']}
  >
  ...

  ...
  // authorization will fail
  <AuthorizedRoute
    path='/authorized-section'
    requires={['canManageUsers', 'canViewUsers']}
  >
  ...
  ```

We also provide authorized section to cover cases where we need authorization but want to be route agnostic

```js
class Home extends React.Component {
  render() {
    return (
      <Fragment>
        <Header />
        <AuthorizedSection requires="ADMIN">
          {({ isAuthorized }) => (isAuthorized ? <Users /> : null)}
        </AuthorizedSection>
      </Fragment>
    );
  }
}
```

This works exactly like AuthorizedRoute but will attempt access regardless of active route.

Since permissions are being fetched from context, it is possible to override them for certain section of our application
using nested `PermissionsProvider`. Result of `authorizationStrategy` does not need to be boolean too.
While most of the time it being a boolean might be convenient. It is possible for `authorizationStrategy`
to return complex object that we can utilize in our component.

```js
const store = createStore(
  state => ({...state}), {
    permissions: {
      ...,
      "nested-permissions": {
        "user-name": {
          create: true,
          read: true,
          update: false,
          delete: false,
        }
      },
      ...,
    }
  });

const authorizationStrategy = (permissions, requirement) => {
  return permissions[requirement];
};

class Header extends React.Component {
  render() {
    return (
      <PermissionsProvider
        permissions={store.getState().permissions[`nested-permissions`]}
        authorizationStrategy={permissionsStrategy}
      >
        <AuthorizedSection
          requires='user-name'
        >
          {({isAuthorized}) => (
            isAuthorized.read ? (
              <Fragment>
              <h4>
                Name
              </h4>
              <span>
                Matt Murdock
              </span>
                {isAuthorized.create && (
                  <button>Add</button>
                )}
                {isAuthorized.delete && (
                  <button>Delete</button>
                )}
            </Fragment>
            ) : null
          )}
        </AuthorizedSection>
      </PermissionsProvider>
    );
  }
}
```

## Config options

### PermissionsProvider

| Property name         | Type                              | Required | Description                                                                                                                      |
| --------------------- | --------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| permissions           | `Array or Object`                 | `true`   | Permissions granted to user throughout the application. Can take any shape or form                                               |
| authorizationStrategy | `(permissions, requirement) => *` | `true`   | Function that is aware of permissions format and is called for each authorization attempt with permissions and given requirement |

### AuthorizedRoute

| Property name         | Type                              | Required | Description                                                                                           |
| --------------------- | --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| path                  | `string`                          | `true`   | Path that when accessed in by browser, will trigger authorization attempt                             |
| requires              | `*`                               | `false`  | Requirement that will be used in access attempt call                                                  |
| authorizationStrategy | `(permissions, requirement) => *` | `false`  | Function that if passed will override `authorizationStrategy` passed to nearest `PermissionsProvider` |

### AuthorizedSection

| Property name         | Type                              | Required | Description                                                                                           |
| --------------------- | --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| requires              | `*`                               | `true`   | Requirement that will be used in access attempt call                                                  |
| authorizationStrategy | `(permissions, requirement) => *` | `false`  | Function that if passed will override `authorizationStrategy` passed to nearest `PermissionsProvider` |
