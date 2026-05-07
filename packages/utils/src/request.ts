export type RestApiMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';

type RequestParam = {
  method: RestApiMethod | Uppercase<RestApiMethod>;
  url: string;
  headers?: Headers;
  baseUrl: string;
  query?: Record<string, string> | null;
  body?: Record<string, any>;
  signal?: AbortSignal;
  /** 首字节超时：等待服务器响应的超时时间，收到响应后不再计时 */
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
  if (query) {
    Object.entries(query).forEach(([key, val]) => {
      _url.searchParams.append(key, val);
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeout);
  const onAbort = () => clearTimeout(timeoutId);
  signal?.addEventListener('abort', onAbort, { once: true });
  const combinedSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;

  const reqInit: RequestInit = {
    method: _method,
    headers,
    signal: combinedSignal,
  };

  if (_method !== 'GET' && body) {
    reqInit.body = JSON.stringify(body);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(_url, reqInit);

  clearTimeout(timeoutId);
  signal?.removeEventListener('abort', onAbort);

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
