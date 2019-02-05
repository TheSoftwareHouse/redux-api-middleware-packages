// @flow

import React from 'react';
import { PermissionsContext } from '../permissions-context/permissions.context';

export type PermissionsProviderProps = {
  permissions: *,
  authorizationStrategy: (*, *) => *,
  children: *,
};

export class PermissionsProvider extends React.Component<PermissionsProviderProps> {
  render() {
    const { children, ...rest } = this.props;
    return <PermissionsContext.Provider value={rest}>{children}</PermissionsContext.Provider>;
  }
}

export default PermissionsProvider;
