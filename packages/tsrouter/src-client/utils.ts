import { kebabCase } from 'lodash-es';

type ParseUrlParams = {
  path: string | string[];
  baseUrl: string;
  query?: Record<string, string>;
  prefix?: string;
};

export const parseUrl = ({ baseUrl, path, query, prefix }: ParseUrlParams) => {
  if (typeof path === 'string') {
    if (prefix) {
      path = path.startsWith('/') ? `${prefix}${path}` : `${prefix}/${path}`;
    }
  } else {
    if (prefix) {
      path.unshift(prefix);
    }
    path = path.map(kebabCase).join('/');
  }
  const url = new URL(path, baseUrl);
  if (query) {
    Object.entries(query).map(([key, value]) => url.searchParams.append(key, value));
  }
  return url.href;
};

export const appendHeaders = (headers: Headers, record?: HeadersInit) => {
  if (!record) return;
  if (record instanceof Headers) {
    headers.forEach((val, key) => headers.append(key, val));
  } else {
    Object.entries(record).forEach(([key, val]) => headers.set(key, val));
  }
};

export class RefreshSuccess extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class RefreshFailed extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
