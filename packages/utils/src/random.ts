import { customAlphabet } from 'nanoid';
const customNanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890', 12);
export const nanoid = (len?: number) => customNanoid(len);
