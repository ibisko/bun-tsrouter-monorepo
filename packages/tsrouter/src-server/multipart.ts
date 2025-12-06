import Busboy, { BusboyConfig, BusboyEvents } from '@fastify/busboy';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction, RequestPayload } from 'fastify';
import { merge } from 'lodash-es';

export type UploadMultipartCallback = {
  (req: FastifyRequest): Promise<{
    setBusboyConfig?: (req: FastifyRequest) => BusboyConfig;
    onFile: BusboyEvents['file'];
    onField?: BusboyEvents['field'];
    onError?: (err: any) => Promise<void>;
    onFinish?: () => Promise<void>;
  }>;
};

export const uploadMultipart = (callback: UploadMultipartCallback) => {
  return {
    preParsing: async (req: FastifyRequest, reply: FastifyReply, payload: RequestPayload) => {
      const { setBusboyConfig, onFile, onField, onError, onFinish } = await callback(req);
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
        await onFinish?.();
        reply.send('ok');
      });
      payload.pipe(busboy);
    },
  };
};
