type Method = 'POST' | 'GET';

type RequestParam = {
  method: Method;
  url: string;
  headers?: Headers;
  host: string;
  query?: Record<string, string>;
  body?: Record<string, any>;
  signal?: AbortSignal;
};

export async function jsonRequest({ method, url, host, query, body, headers = new Headers(), signal }: RequestParam) {
  const _url = new URL(url, host);

  if (query) {
    Object.entries(query).forEach(([key, val]) => {
      _url.searchParams.append(key, val);
    });
  }

  const reqInit: RequestInit = {
    method,
    headers,
    signal,
  };
  if (method === 'POST' && body) {
    reqInit.body = JSON.stringify(body);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(_url, reqInit);

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
