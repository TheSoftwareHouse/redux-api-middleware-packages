// @flow

export function permissionsStrategy(permissions: { [string]: boolean }, requirement: string): boolean {
  return permissions[requirement] || false;
}

export function roleBasedStrategy(roles: Array<string>, requirement: string): boolean {
  return !!roles.find(role => role === requirement);
}

export function atLeastOneStrategy(permissions: { [string]: boolean }, requirement: Array<string> | string): boolean {
  if (Array.isArray(requirement)) {
    return !!requirement.find(x => permissions[x]);
  }
  return permissions[requirement] || false;
}
