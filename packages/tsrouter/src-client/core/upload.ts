import { ResponseError } from '../error';
import type { TsRouterClass, UploadMethodOptions } from '../type';
import { parseUrl } from '../utils';

export async function upload(this: TsRouterClass, path: string[], formData: FormData, options: UploadMethodOptions = {}) {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = parseUrl({
      baseUrl: this.baseUrl,
      prefix: this.prefix,
      path,
      query: options.query,
    });
    xhr.open('POST', url, true);

    if (this.setHeaders) {
      const headers = new Headers();
      await this.setHeaders(headers);
      headers.entries().forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        const percent = ((event.loaded / event.total) * 10000) / 100;
        options.onPercent?.(percent);
      }
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else if (xhr.status >= 400) {
        // todo 给个特别的
        reject(new ResponseError({ message: xhr.response, status: xhr.status }));
      }
    });
    xhr.addEventListener('error', () => reject(new Error('网络错误')));
    xhr.addEventListener('abort', () => reject(new Error('上传被取消')));

    xhr.send(formData);
  });
}
