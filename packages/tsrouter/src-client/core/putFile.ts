import type { TsRouterClass, XhrMethodOptions } from '../type';
import { safeJsonParse, warpperRefreshTokenCatch } from '../utils';
import { baseFetch } from './baseFetch';
import { baseXMLHttpRequest } from './baseXMLHttpRequest';

export const createPutFileXhr = (tsRouter: TsRouterClass) => async (path: string[], file: XMLHttpRequestBodyInit, options?: XhrMethodOptions) => {
  return warpperRefreshTokenCatch(tsRouter, () => baseXMLHttpRequest(tsRouter, { path, method: 'PUT', body: file, options }));
};

export const createPutFile = (tsRouter: TsRouterClass) => async (path: string[], file: BodyInit, options?: XhrMethodOptions) => {
  const response = await warpperRefreshTokenCatch(tsRouter, () => baseFetch(tsRouter, { method: 'PUT', path, body: file, options }));
  const text = await response.text();
  return safeJsonParse(text);
};
