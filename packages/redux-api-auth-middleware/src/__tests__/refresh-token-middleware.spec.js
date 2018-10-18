import { RSAA, apiMiddleware } from 'redux-api-middleware';
import configureMockStore from 'redux-mock-store';
import nodeFetch from 'node-fetch';
import fetchMock from 'fetch-mock';

import createRefreshTokenMiddleware from '../refresh-token-middleware';
import createAuthMiddleware from '../auth-middleware';
import {
  authReducer,
  REFRESH_TOKEN_FAILURE,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  refreshTokenAction,
} from '../store';
import { tokens } from './const';

const refreshEndpoint = 'https://example.com/refresh-token';
const apiEndpoint = 'https://example.com/users';

const authMiddleware = createAuthMiddleware({
  header: 'Authorization',
});
const refreshTokenMiddleware = createRefreshTokenMiddleware({
  endpoint: refreshEndpoint,
  failedAction: { type: 'LOGOUT' },
});
const middlewares = [authMiddleware, refreshTokenMiddleware, apiMiddleware];
const mockStore = configureMockStore(middlewares);
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

fetchMock.config.overwriteRoutes = true;

describe('Refresh token middleware', () => {
  let next, store;

  beforeEach(() => {
    global.fetch = nodeFetch;
    next = jest.fn();

    store = {
      dispatch: jest.fn(() => new Promise(resolve => resolve({ error: true }))),
      getState: () => ({ auth: { ...tokens } }),
    };
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('handles only RSAA', () => {
    const action = {
      type: 'FOO',
    };
    refreshTokenMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);

    const altAction = refreshTokenAction({ refreshToken: tokens.refreshToken, endpoint: refreshEndpoint });
    refreshTokenMiddleware(store)(next)(altAction);
    expect(next).toHaveBeenCalledWith(altAction);
  });

  it('handles token request reducer', () => {
    expect(authReducer({}, { type: REFRESH_TOKEN_REQUEST })).toEqual({ isRefreshing: true });
  });

  it('handles token success reducer', () => {
    expect(authReducer({}, { type: REFRESH_TOKEN_SUCCESS, payload: { ...tokens } })).toEqual({
      ...tokens,
      isRefreshing: false,
    });
  });

  it('handles token failure reducer', () => {
    expect(authReducer({}, { type: REFRESH_TOKEN_FAILURE })).toEqual({
      authToken: null,
      isRefreshing: false,
      refreshToken: null,
    });
  });

  it('throws an error if refresh token url is not specified', () => {
    expect(() => {
      createRefreshTokenMiddleware();
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws an error if reducer is not set correctly', () => {
    const badStore = {
      getState: () => ({ badKey: null }),
    };
    const middleware = () => refreshTokenMiddleware(badStore)(next)({ type: 'FOO' });
    expect(middleware).toThrowErrorMatchingSnapshot();
  });

  it('tries to refresh token when there is 401 response status', async () => {
    const store = mockStore({ auth: { ...tokens } });
    const action = {
      [RSAA]: {
        endpoint: apiEndpoint,
        method: 'GET',
        types: ['API_REQUEST', 'API_SUCCESS', 'API_FAILURE'],
      },
    };
    fetchMock.mock(refreshEndpoint, 200);
    fetchMock.mock(apiEndpoint, 401);
    await store.dispatch(action);
    expect(store.getActions()).toEqual(expect.arrayContaining([{ type: REFRESH_TOKEN_REQUEST }]));
    fetchMock.mock(apiEndpoint, 200);
    await flushPromises();
    expect(store.getActions()).toEqual(expect.arrayContaining([{ type: 'API_SUCCESS' }]));
  });

  it('skips dispatch failed requests after failed refresh token and dispatch logout', async () => {
    const store = mockStore({ auth: { ...tokens } });
    fetchMock.mock(refreshEndpoint, 500);
    fetchMock.mock(apiEndpoint, 401);

    const action = {
      [RSAA]: {
        endpoint: apiEndpoint,
        method: 'GET',
        types: ['API_REQUEST', 'API_SUCCESS', 'API_FAILURE'],
      },
    };

    await store.dispatch(action);
    await flushPromises();
    expect(store.getActions()).toEqual(expect.arrayContaining([{ type: REFRESH_TOKEN_REQUEST }]));
    expect(store.getActions()).toEqual(expect.arrayContaining([{ type: 'LOGOUT' }]));
  });
});
