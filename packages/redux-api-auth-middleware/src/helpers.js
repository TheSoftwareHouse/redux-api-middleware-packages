// @flow

import type { AnyObject } from './types';

export function timestampNow() {
  return Math.floor(+new Date() / 1000); // equal to timestampNow()
}

export function parseJWTPayload(token: string): AnyObject | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export function calculateJWTTokenExpirationDate(payload: AnyObject): number {
  if (!payload || !payload.authToken) return 0;
  const token = parseJWTPayload(payload.authToken);
  if (!token) return 0;
  const { iat, exp } = token;
  return iat && exp ? Number(iat) + Number(exp) : 0;
}

export function calculateOauthTokenExpirationDate(payload: AnyObject): number {
  if (!payload || !payload.expires_in) return 0;
  const { expires_in } = payload;
  return timestampNow() + expires_in;
}

export function isTokenExpired(expires: number): boolean {
  return expires ? expires - timestampNow() < 0 : true;
}
