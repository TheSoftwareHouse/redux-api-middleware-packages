import { createStore, combineReducers } from 'redux';
import { RSAA } from 'redux-api-middleware';
import createAuthMiddleware from '../auth-middleware';
import { SET_TOKEN, CLEAR_TOKEN, authReducer, clearToken, setToken } from '../store';

const authMiddleware = createAuthMiddleware();

import { tokens } from './const';

describe('Auth middleware', () => {
  const authHeaders = { Authorization: `Bearer ${tokens.authToken}` };

  let next, store;

  beforeEach(() => {
    next = jest.fn();
    store = createStore(combineReducers({ auth: authReducer }));
  });

  it('should create an action to set the token', () => {
    const expectedAction = {
      type: SET_TOKEN,
      payload: { ...tokens },
    };
    expect(setToken({ ...tokens })).toEqual(expectedAction);
  });

  it('should create an action to clear the token', () => {
    const expectedAction = {
      type: CLEAR_TOKEN,
    };
    expect(clearToken()).toEqual(expectedAction);
  });

  it('should handle only RSAA', () => {
    authMiddleware(store)(next)({
      type: 'FOO',
    });

    expect(next).toHaveBeenCalledWith({
      type: 'FOO',
    });
  });

  it('should add auth headers when there is a token in the store', () => {
    store.dispatch(setToken({ ...tokens }));
    authMiddleware(store)(next)({
      [RSAA]: {
        foo: 'bar',
        body: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        body: {
          foo: 'bar',
        },
        headers: authHeaders,
      },
    });
  });

  it('should skip auth headers when there is no token in the store', () => {
    store.dispatch(clearToken());
    authMiddleware(store)(next)({
      [RSAA]: {
        foo: 'bar',
        body: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        body: {
          foo: 'bar',
        },
      },
    });
  });

  it('throws an error if reducer is not set correctly', () => {
    const badStore = createStore(combineReducers({ badKey: () => null }));
    const middleware = () => authMiddleware(badStore)(next)({ type: 'FOO' });
    expect(middleware).toThrowErrorMatchingSnapshot();
  });
});
