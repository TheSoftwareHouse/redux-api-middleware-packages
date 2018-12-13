import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { MemoryRouter, Switch } from 'react-router';

import AuthorizedRoute from './authorized-route';
import PermissionsProvider from '../permissions-provider/permissions-provider';

Enzyme.configure({ adapter: new Adapter() });

describe('Authorized Route', () => {
  function strategy(permissions, requirement) {
    return permissions[requirement] || false;
  }

  function otherStrategy(permissions, requirement) {
    return !permissions[requirement] || false;
  }

  it('display logout portion when is not authorized', () => {
    const authorization = jest.fn();
    mount(
      <PermissionsProvider permissions={{ isLogged: false }} authorizationStrategy={strategy}>
        <MemoryRouter initialEntries={['/restricted']}>
          <Switch>
            <AuthorizedRoute path="/restricted" requires="isLogged">
              {({ isAuthorized }) => authorization(isAuthorized)}
            </AuthorizedRoute>
          </Switch>
        </MemoryRouter>
      </PermissionsProvider>,
    );
    expect(authorization).toBeCalledWith(false);
  });

  it('display login portion when is authorized', () => {
    const authorization = jest.fn();
    mount(
      <PermissionsProvider permissions={{ isLogged: true }} authorizationStrategy={strategy}>
        <MemoryRouter initialEntries={['/restricted']}>
          <Switch>
            <AuthorizedRoute path="/restricted" requires="isLogged">
              {({ isAuthorized }) => authorization(isAuthorized)}
            </AuthorizedRoute>
          </Switch>
        </MemoryRouter>
      </PermissionsProvider>,
    );
    expect(authorization).toBeCalledWith(true);
  });

  it('authorization strategy may be overridden for particular route', () => {
    const authorization = jest.fn();
    mount(
      <PermissionsProvider permissions={{ isLogged: true }} authorizationStrategy={strategy}>
        <MemoryRouter initialEntries={['/restricted']}>
          <Switch>
            <AuthorizedRoute path="/restricted" requires="isLogged" authorizationStrategy={otherStrategy}>
              {({ isAuthorized }) => authorization(isAuthorized)}
            </AuthorizedRoute>
          </Switch>
        </MemoryRouter>
      </PermissionsProvider>,
    );
    expect(authorization).toBeCalledWith(false);
  });
});
