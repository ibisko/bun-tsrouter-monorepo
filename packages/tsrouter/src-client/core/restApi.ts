import { MethodOptions, TsRouterClass } from '../type';
import { RestApiMethod } from '@packages/utils';
import { safeJsonParse, warpperRefreshTokenCatch } from '../utils';
import { baseFetch, Query } from './baseFetch';

export const createGetMethod = (tsRouter: TsRouterClass) => async (path: string[], query: Query, options?: Omit<MethodOptions, 'query'>) => {
  const fn = () => baseFetch(tsRouter, { method: 'GET', path, query, options });
  const response = options?.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
  const text = await response.text();
  return safeJsonParse(text);
};

export const createStandardMethod =
  (tsRouter: TsRouterClass, method: Uppercase<RestApiMethod>) => async (path: string[], body: any, options?: MethodOptions) => {
    const fn = () => baseFetch(tsRouter, { method, path, body, options });
    const response = options?.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
    const text = await response.text();
    return safeJsonParse(text);
  };

export const createPostFormData =
  (tsRouter: TsRouterClass) =>
  async (path: string[], formData: FormData, options: MethodOptions = {}) => {
    const fn = () => baseFetch(tsRouter, { method: 'POST', path, body: formData, options });
    const response = options?.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
    const text = await response.text();
    return safeJsonParse(text);
  };

export const createDownloadMethod = (tsRouter: TsRouterClass) => async (path: string[], query: Query, options: Omit<MethodOptions, 'query'>) => {
  const fn = () => baseFetch(tsRouter, { method: 'GET', path, query, options });
  return options?.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
};
