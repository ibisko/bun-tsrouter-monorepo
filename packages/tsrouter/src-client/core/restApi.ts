import { MethodOptions, TsRouterClass } from '../type';
import { RestApiMethod } from '@packages/utils';
import { safeJsonParse, warpperRefreshTokenCatch } from '../utils';
import { baseFetch, Query } from './baseFetch';

export const createGetMethod = (tsRouter: TsRouterClass) => async (path: string[], query: Query, options: Omit<MethodOptions, 'query'>) => {
  const response = await warpperRefreshTokenCatch(tsRouter, () => baseFetch(tsRouter, { method: 'GET', path, query, options }));
  const text = await response.text();
  return safeJsonParse(text);
};

export const createStandardMethod =
  (tsRouter: TsRouterClass, method: Uppercase<RestApiMethod>) => async (path: string[], body: any, options: MethodOptions) => {
    const response = await warpperRefreshTokenCatch(tsRouter, () => baseFetch(tsRouter, { method, path, body, options }));
    const text = await response.text();
    return safeJsonParse(text);
  };

export const createPostFormData =
  (tsRouter: TsRouterClass) =>
  async (path: string[], formData: FormData, options: MethodOptions = {}) => {
    const response = await warpperRefreshTokenCatch(tsRouter, () => baseFetch(tsRouter, { method: 'POST', path, body: formData, options }));
    const text = await response.text();
    return safeJsonParse(text);
  };

export const createDownloadMethod = (tsRouter: TsRouterClass) => async (path: string[], query: Query, options: Omit<MethodOptions, 'query'>) =>
  warpperRefreshTokenCatch(tsRouter, () => baseFetch(tsRouter, { method: 'GET', path, query, options }));
