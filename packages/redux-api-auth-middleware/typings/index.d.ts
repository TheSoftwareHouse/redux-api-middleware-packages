import { Middleware, AnyAction, Reducer } from 'redux';

type MiddlewareConfig = {
  authConfig: AuthConfig;
  refreshConfig?: RefreshConfig;
};

type AuthConfig = {
  header: string;
  type: string;
};

type RefreshConfig = {
  endpoint: string;
  failedAction: AnyAction;
};

type AnyObject = {
  [key: string]: any;
};

type calculateTokenExpirationDate = (response: AnyObject) => number;

type ReducerOptions = {
  getExpirationTimestamp?: calculateTokenExpirationDate;
};

type TokenActionType = {
  authToken: string;
  refreshToken?: string;
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
