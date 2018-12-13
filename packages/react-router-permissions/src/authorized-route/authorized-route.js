// @flow

import React from 'react';
import { Route } from 'react-router';
import { AuthorizedSection } from '../authorized-section/authorized-section';
import type { Route as RouteType, ContextRouter } from 'react-router';
import type { AuthorizedSectionProps } from '../authorized-section/authorized-section';

export type AuthorizedRouteProps = {
  path: string,
} & AuthorizedSectionProps &
  RouteType;

export class AuthorizedRoute extends React.Component<AuthorizedRouteProps> {
  render() {
    const { authorizationStrategy, requires, children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        children={(routerProps: ContextRouter) =>
          routerProps.match ? (
            <AuthorizedSection
              requires={requires}
              authorizationStrategy={authorizationStrategy}
              children={({ isAuthorized }: { isAuthorized: * }) => children({ ...routerProps, isAuthorized })}
            />
          ) : null
        }
      />
    );
  }
}

export default AuthorizedRoute;
