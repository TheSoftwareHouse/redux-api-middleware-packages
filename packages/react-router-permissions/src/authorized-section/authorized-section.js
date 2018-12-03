// @flow

import * as React from 'react';
import { PermissionsContext } from '../permissions-context/permissions.context';

export type AuthorizedSectionProps = {
  requires: *,
  authorizationStrategy?: (*, *) => *,
  children: ({
    isAuthorized: boolean,
  }) => React.Node,
  [string]: *,
};

export class AuthorizedSection extends React.Component<AuthorizedSectionProps> {
  render() {
    const { requires, authorizationStrategy: overrideStrategy, children, ...rest } = this.props;

    return (
      <PermissionsContext.Consumer>
        {({ authorizationStrategy, permissions }) => {
          const isAuthorized = overrideStrategy
            ? overrideStrategy(permissions, requires)
            : authorizationStrategy(permissions, requires);
          return children({
            ...rest,
            isAuthorized,
          });
        }}
      </PermissionsContext.Consumer>
    );
  }
}
