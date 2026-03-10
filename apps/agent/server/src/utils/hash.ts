import crypto from 'crypto';

export const hashString = (data: string | Buffer<ArrayBufferLike>, algorithm = 'SHA-1') => {
  const hash = crypto.createHash(algorithm);
  return hash.update(data).digest('hex');
};
