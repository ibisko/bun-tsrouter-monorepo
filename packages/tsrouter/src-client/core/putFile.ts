import type { TsRouterClass, XhrMethodOptions } from '../type';
import { warpperRefreshTokenCatch } from '../utils';
import { baseXMLHttpRequest } from './baseXMLHttpRequest';

export const createPutFile = (tsRouter: TsRouterClass) => async (path: string[], file: XMLHttpRequestBodyInit, options?: XhrMethodOptions) => {
  return warpperRefreshTokenCatch(tsRouter, () => baseXMLHttpRequest(tsRouter, { path, method: 'PUT', body: file, options }));
};
