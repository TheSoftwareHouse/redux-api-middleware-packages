import { Middleware, AnyAction, Reducer } from 'redux';

type MiddlewareConfig = {
  authConfig: AuthConfig;
  refreshConfig?: RefreshConfig;
};

type AuthConfig = {
  header: string;
  type: string;
};

type refreshTokenActionParams = { refreshToken: string; endpoint: string };

type RefreshConfig = {
  endpoint: string;
  failedAction: AnyAction;
  actionDefinition?: (params: refreshTokenActionParams) => object;
};

type AnyObject = {
  [key: string]: any;
};

type calculateTokenExpirationDate = (response: AnyObject) => number;

type ReducerOptions = {
  getExpirationTimestamp?: calculateTokenExpirationDate;
};

type TokenActionType = {
  auth_token: string;
  refresh_token?: string;
  expires_in?: number;
};

type AuthState = {
  authToken: null | string;
  refreshToken: null | string;
  expires: number;
};

export function setTokenAction(params: TokenActionType): AnyAction;

export function clearTokenAction(): AnyAction;

export function createAuthMiddleware(options: MiddlewareConfig): Middleware;

export function createAuthReducer(options?: ReducerOptions): Reducer<AuthState, AnyAction>;

export function calculateOauthTokenExpirationDate(response: AnyObject): number;

export function calculateJWTTokenExpirationDate(response: AnyObject): number;

export const SET_TOKEN: string;

export const CLEAR_TOKEN: string;

export const REFRESH_TOKEN_REQUEST: string;

export const REFRESH_TOKEN_FAILURE: string;

export const REFRESH_TOKEN_SUCCESS: string;
