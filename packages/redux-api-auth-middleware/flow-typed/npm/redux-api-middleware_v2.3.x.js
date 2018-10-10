declare module 'redux-api-middleware' {
  import type { Middleware } from 'redux';

  declare export var RSAA: string;

  declare export type HTTPVerb = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

  declare export type RSAAction<R, S, F> = {
    [typeof RSAA]: {
      endpoint: string | ((state: any) => string),
      method: HTTPVerb,
      body?: any,
      headers?: { [string]: string } | ((state: any) => { [string]: string }),
      options?: { [string]: any } | ((state: any) => { [string]: any }),
      credentials?: 'omit' | 'same-origin' | 'include',
      bailout?: boolean | ((state: any) => boolean),
      fetch?: (url: string | Request, init?: RequestOptions) => Promise<Response>,
      types: [R, S, F],
    },
  };

  declare export function isRSAA(action: Object): boolean;

  declare export function validateRSAA(action: Object): string[];

  declare export function isValidRSAA(action: Object): boolean;

  declare export class InvalidRSAA {
    constructor(validationErrors: string[]): this;

    name: string;
    message: string;
    validationErrors: Array<string>;
  }

  declare export class InternalError {
    constructor(message: string): this;

    name: string;
    message: string;
  }

  declare export class RequestError {
    constructor(message: string): this;

    name: string;
    message: string;
  }

  declare export class ApiError {
    constructor(status: number, statusText: string, response: any): this;

    name: string;
    message: string;
    status: number;
    statusText: string;
    response?: any;
  }

  declare export function getJSON(res: Response): ?Promise<any>;

  declare export var apiMiddleware: Middleware<>;
}
