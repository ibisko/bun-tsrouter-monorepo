import type { TsRouterClass, XhrMethodOptions } from '../type';
import { safeJsonParse, warpperRefreshTokenCatch } from '../utils';
import { baseFetch } from './baseFetch';
import { baseXMLHttpRequest } from './baseXMLHttpRequest';

export const createPutFileXhr = (tsRouter: TsRouterClass) => async (path: string[], file: XMLHttpRequestBodyInit, options?: XhrMethodOptions) => {
  const fn = () => baseXMLHttpRequest(tsRouter, { path, method: 'PUT', body: file, options });
  return options?.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
};

export const createPutFile = (tsRouter: TsRouterClass) => async (path: string[], file: BodyInit, options?: XhrMethodOptions) => {
  const fn = () => baseFetch(tsRouter, { method: 'PUT', path, body: file, options });
  const response = options?.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
  const text = await response.text();
  return safeJsonParse(text);
};
