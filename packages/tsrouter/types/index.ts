import { RestApiMethod } from '@packages/utils';

export type Method = RestApiMethod | 'sse' | 'postFormData' | 'putFile' | 'putFileXhr' | 'download';
