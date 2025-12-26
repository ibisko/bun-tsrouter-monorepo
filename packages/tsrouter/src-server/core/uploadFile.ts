import Busboy from '@fastify/busboy';
import { UploadMultipartCallback } from '../multipart';
import { getContext, getPath } from '../utils';
import { RouterServerInterface } from './types';
import { merge } from 'lodash-es';

export function uploadFile(this: RouterServerInterface, path: string[], service: UploadMultipartCallback) {
  const url = getPath(path);
  const logger = this.fastify.log.child({ method: service.name });
  // this.fastify.post(url, uploadMultipart(service), () => {});
  this.fastify.post(
    url,
    {
      preParsing: async (req, reply, payload) => {
        const ctx = getContext(req);
        ctx.logger = this.formatLogger ? logger.child(this.formatLogger(req, reply)) : logger;
        const { setBusboyConfig, onFile, onField, onError, onFinish } = await service(req, reply, ctx);
        const defaultBusboyConfig = {
          headers: {
            'content-type': req.headers['content-type']!,
          },
          // highWaterMark: 5 * 10 ** 6,
          // limits: {
          //   // fileSize: 5 * 10 ** 6, // 文件大小限制
          //   // files: 5, // 文件数量限制
          //   // fields: 10, // 字段数量限制
          // },
        };
        const busboy = new Busboy(setBusboyConfig ? merge(defaultBusboyConfig, setBusboyConfig(req)) : defaultBusboyConfig);
        busboy.on('file', (fieldname, stream, filename, transferEncoding, mimeType) => {
          onFile?.(fieldname, stream, filename, transferEncoding, mimeType);
        });
        busboy.on('field', (...params) => {
          onField?.(...params);
        });
        busboy.on('error', async err => {
          await onError?.(err);
          reply.status(400).send(err);
        });
        busboy.on('finish', async () => {
          const res = await onFinish?.();
          // todo 可以追加下载逻辑吧？上传成功后响应的是一个文件下载
          reply.send(res);
        });
        payload.pipe(busboy);
      },
    },
    () => {},
  );
}
