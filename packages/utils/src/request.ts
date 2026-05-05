export type RestApiMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';

type RequestParam = {
  method: RestApiMethod | Uppercase<RestApiMethod>;
  url: string;
  headers?: Headers;
  baseUrl: string;
  query?: Record<string, string> | null;
  body?: Record<string, any>;
  signal?: AbortSignal;
  timeout?: number;
  skipErrorHandler?: boolean;
};

export async function jsonRequest({
  method,
  url,
  baseUrl,
  query,
  body,
  headers = new Headers(),
  signal,
  timeout = 1e3 * 60,
  skipErrorHandler,
}: RequestParam) {
  const _method = method.toUpperCase();
  const _url = new URL(url, baseUrl);

  if (query) Object.entries(query).forEach(([key, val]) => _url.searchParams.append(key, val));

  const signals = [AbortSignal.timeout(timeout)];
  if (signal) signals.push(signal);

  const reqInit: RequestInit = {
    method: _method,
    headers,
    signal: AbortSignal.any(signals),
  };
  if (_method !== 'GET' && body) {
    reqInit.body = JSON.stringify(body);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(_url, reqInit);

  if (skipErrorHandler) return response;

  if (!response.ok) {
    let msg = await response.text();
    try {
      const obj = JSON.parse(msg);
      msg = obj.message || obj.msg || msg;
    } catch {}
    throw new Error(`${response.status} ${msg}`);
  }

  return response;
}
