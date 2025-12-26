import { BusboyConfig, BusboyEvents } from '@fastify/busboy';
import { FastifyReply, FastifyRequest } from 'fastify';
import { merge } from 'lodash-es';
import { Context } from './type';
import path from 'path';
import fs from 'fs';
import { fsEnsureMkdir } from '@packages/utils/server';
import { nanoid } from '@packages/utils';
import { format } from 'date-fns';

export type UploadMultipartCallback = {
  (req: FastifyRequest, reply: FastifyReply, ctx: Context): Promise<{
    setBusboyConfig?: (req: FastifyRequest) => BusboyConfig;
    onFile: BusboyEvents['file'];
    onField?: BusboyEvents['field'];
    onError?: (err: any) => Promise<void>;
    onFinish?: () => Promise<any>;
  }>;
};

// todo FormData 表单字段还是需要的
/** 接受上传的单个文件 */
export const createUploadFile =
  (tmpFolder: string) =>
  (callback: (req: FastifyRequest & { file: File }, ctx: Context) => {}): UploadMultipartCallback =>
  async (req, reply, ctx) => {
    let filename = '';
    let transferEncoding = '';
    let mimeType = '';
    let fileNanoid = nanoid();
    let dirPath = path.join(tmpFolder, `${format(new Date(), 'yyyyMMddHHmmss')}-${fileNanoid}`);
    await fsEnsureMkdir(dirPath);
    let filePath = '';
    let extname = '';
    const fields: Record<string, string> = {};
    return {
      async onFile(_fieldname, stream, _filename, _transferEncoding, _mimeType) {
        filename = _filename;
        extname = path.extname(_filename);
        filePath = path.join(dirPath, fileNanoid + extname);
        transferEncoding = _transferEncoding;
        mimeType = _mimeType;
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
      },
      onField(fieldname, value) {
        fields[fieldname] = value;
      },
      async onFinish() {
        const file: File = {
          fields,
          filename,
          transferEncoding,
          mimeType,
          filePath,
          fileNanoid,
          dirPath,
          extname,
        };
        const cbreq = merge(req, { file });
        return callback(cbreq, ctx);
      },
    };
  };

type File = {
  fields: Record<string, string>;
  filename: string;
  extname: string;
  filePath: string;
  fileNanoid: string;
  dirPath: string;
  transferEncoding: string;
  mimeType: string;
};
