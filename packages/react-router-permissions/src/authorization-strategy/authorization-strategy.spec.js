import { atLeastOneStrategy, permissionsStrategy, roleBasedStrategy } from './authorization-strategy';

test('permission strategy', () => {
  expect(permissionsStrategy({}, 'isLogged')).toBe(false);
  expect(permissionsStrategy({ isLogged: false }, 'isLogged')).toBe(false);
  expect(permissionsStrategy({ isLogged: true }, 'isLogged')).toBe(true);
});

test('role based strategy', () => {
  expect(roleBasedStrategy([], 'ADMIN')).toBe(false);
  expect(roleBasedStrategy(['AUTHOR'], 'ADMIN')).toBe(false);
  expect(roleBasedStrategy(['AUTHOR', 'MODERATOR'], 'ADMIN')).toBe(false);
  expect(roleBasedStrategy(['ADMIN'], 'ADMIN')).toBe(true);
});

test('permission strategy can get multiple requirements, at least one must be satisfied', () => {
  const permisions = {
    isAdmin: false,
    isModerator: false,
    isUser: true,
  };
  expect(atLeastOneStrategy(permisions, 'isAdmin')).toBe(false);
  expect(atLeastOneStrategy(permisions, ['isAdmin'])).toBe(false);
  expect(atLeastOneStrategy(permisions, ['isAdmin', 'isModerator'])).toBe(false);
  expect(atLeastOneStrategy(permisions, ['isUser'])).toBe(true);
  expect(atLeastOneStrategy(permisions, ['isUser', 'isModerator'])).toBe(true);
  expect(atLeastOneStrategy(permisions, 'isUser')).toBe(true);
});
