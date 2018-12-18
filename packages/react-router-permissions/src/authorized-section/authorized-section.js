// @flow

import * as React from 'react';
import { PermissionsContext } from '../permissions-context/permissions.context';

export type AuthorizedSectionProps = {
  requires: *,
  authorizationStrategy?: (permissions: *, requirement: *) => *,
  children: ({
    isAuthorized: *,
  }) => React.Node,
};

export class AuthorizedSection extends React.Component<AuthorizedSectionProps> {
  render() {
    const { requires, authorizationStrategy: overrideStrategy, children } = this.props;

    return (
      <PermissionsContext.Consumer>
        {({ authorizationStrategy, permissions }) => {
          const isAuthorized = overrideStrategy
            ? overrideStrategy(permissions, requires)
            : authorizationStrategy(permissions, requires);
          return children({
            isAuthorized,
          });
        }}
      </PermissionsContext.Consumer>
    );
  }
}
