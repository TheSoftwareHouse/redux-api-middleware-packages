import { createStore, combineReducers } from 'redux';
import { RSAA } from 'redux-api-middleware';
import authReducer from '../reducer';
import authMiddleware from '../middleware';
import { SET_TOKEN, CLEAR_TOKEN } from '../action-types';
import { clearAuthToken, setAuthToken } from '../action';

describe('Auth middleware', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQifQ.w8piG6mIk3XwZJRjdsCUxfIcNw33OwQMrM06ZVOzESE';
  const authHeaders = { Authorization: `Bearer ${token}` };

  let next, store;

  beforeEach(() => {
    next = jest.fn();
    store = createStore(combineReducers({ auth: authReducer }));
  });

  it('should create an action to set the token', () => {
    const expectedAction = {
      type: SET_TOKEN,
      payload: { token },
    };
    expect(setAuthToken(token)).toEqual(expectedAction);
  });

  it('should create an action to clear the token', () => {
    const expectedAction = {
      type: CLEAR_TOKEN,
    };
    expect(clearAuthToken()).toEqual(expectedAction);
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
    store.dispatch(setAuthToken(token));
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
    store.dispatch(clearAuthToken());
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
    const badStore = createStore(combineReducers({ badKey: null }));
    const middleware = () => authMiddleware(badStore)(next)({ type: 'FOO' });
    expect(middleware).toThrowErrorMatchingSnapshot();
  });
});
