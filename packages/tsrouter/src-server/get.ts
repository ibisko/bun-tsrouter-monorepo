import { watchdog } from '@packages/utils';
import z, { ZodObject } from 'zod';
import type { FastifyInstance } from 'fastify';

class RouterServer {
  fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  #getPath = (path: string | string[]) => {
    if (typeof path === 'string') {
      return path;
    }
    return path.join('/');
  };

  parseZodSchema<T extends ZodObject>(zodSchema: T, param: unknown) {
    const resparse = z.safeParse(zodSchema, param);
    if (resparse.error) {
      throw resparse.error;
    }
    return resparse.data as z.output<T>;
  }

  get<T extends ZodObject, R>(path: string | string[], zodSchema: T, service: (param: z.output<T>) => Promise<R>) {
    const url = this.#getPath(path);
    this.fastify.get(url, async (request, reply) => {
      const param = this.parseZodSchema(zodSchema, request.query);
      // todo 第二参数
      const response = await service(param);
      reply.send(response);
    });
  }

  post<T extends ZodObject, R>(path: string | string[], zodSchema: T, service: (param: z.output<T>) => Promise<R>) {
    const url = this.#getPath(path);
    this.fastify.post(url, async (request, reply) => {
      const param = this.parseZodSchema(zodSchema, request.body);
      // todo 第二参数
      const response = await service(param);
      reply.send(response);
    });
  }

  sse<T extends ZodObject, R>(
    path: string | string[],
    zodSchema: T,
    service: (param: z.output<T>, write: WriteFunc) => Promise<R>,
  ) {
    const url = this.#getPath(path);
    this.fastify.get(url, async (request, reply) => {
      const param = this.parseZodSchema(zodSchema, request.query);
      reply.raw.setHeader('access-control-allow-origin', '*');
      reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.setHeader('Cache-Control', 'no-cache,no-transform');
      reply.raw.setHeader('x-no-compression', 1);

      const fead = watchdog(() => {
        reply.raw.write(':\n\n');
        fead();
      }, 1e3 * 15); // 15s 一次发送心跳

      // todo 第二参数
      await new Promise(resolve => {
        request.raw.on('close', () => {
          resolve(null);
        });

        let id = 0;
        service(param, (data, event?: string) => {
          fead();
          const msg = [`id: ${id}`, `data: ${data}`];
          if (event) {
            msg.push(`event: ${event}`);
          }
          reply.raw.write(msg.join('\n') + '\n\n');
          id++;
        })
          // .then(resolve)
          .then(r => {
            resolve(r);
          })
          .catch(resolve);
      });

      fead(true);
      reply.raw.end();
    });
  }
}

type WriteFunc = {
  /** 默认 event 是 message */
  (data: string): void;
  /** 自定义 event */
  (data: string, event: string): void;
};

export const createRouter = (fastify: FastifyInstance, routerTree: any) => {
  const rs = new RouterServer(fastify);

  const parseRouter = (router: any, prefix = '') => {
    for (const [key, value] of Object.entries(router)) {
      const _prefix = prefix + '/' + key;
      if (typeof value === 'function') {
        const func = value as RegisterableProcedure<any, any>;
        switch (func.Method) {
          case 'get':
            func(rs, _prefix);
            return;
          case 'post':
            func(rs, _prefix);
            return;
          case 'sse':
            func(rs, _prefix);
            return;

          default:
            return;
        }
      }
      parseRouter(value, _prefix);
    }
  };
  parseRouter(routerTree);
};

type SSEReturn = (callback: (data: string) => void) => Promise<void>;
type SseHandler<T> = {
  (params: z.output<T>, options?: any): SSEReturn;
};
type StandardHandler<T, R> = {
  (params: z.output<T>, options?: any): Promise<R>;
};

type ProcedureDef<M extends string, T = any, R = any> = {
  Method?: M;
  param?: z.output<T>;
  return?: R;
  func?: Lowercase<M> extends `${string}sse` ? SseHandler<T> : StandardHandler<T, R>;
};

type RegisterableProcedure<M extends string, T = unknown, R = unknown> = ProcedureDef<M, T, R> & {
  (rs: RouterServer, path: string): void;
};

const createStandardMethod = <M extends 'get' | 'post'>(method: M) => {
  return <T extends ZodObject = any, R = any>(zodSchema: T, service: (param: z.output<T>) => Promise<R>) => {
    const func: RegisterableProcedure<M, T, R> = (rs: RouterServer, path: string) =>
      rs[method](path, zodSchema, service);
    func.Method = method;
    return func;
  };
};
const createSseMethod = <M extends 'sse'>(method: M) => {
  return <T extends ZodObject = any, R = any>(
    zodSchema: T,
    service: (param: z.output<T>, write: WriteFunc) => Promise<R>,
  ) => {
    const func: RegisterableProcedure<M, T, R> = (rs: RouterServer, path: string) =>
      rs[method](path, zodSchema, service);
    func.Method = method;
    return func;
  };
};

export const procedure = {
  // get: <T extends ZodObject = any, R = any>(zodSchema: T, service: (param: z.output<T>) => Promise<R>) => {
  //   const func: RegisterableProcedure<'GET', T, R> = (rs: RouterServer, path: string) =>
  //     rs.get(path, zodSchema, service);
  //   func.Method = 'GET';
  //   return func;
  // },

  // post:
  //   <T extends ZodObject = any, R = any>(
  //     zodSchema: T,
  //     service: (param: z.output<T>) => Promise<R>,
  //   ): RegisterableProcedure<'POST', T, R> =>
  //   (rs: RouterServer, path: string) =>
  //     rs.post(path, zodSchema, service),

  // sse:
  //   <T extends ZodObject = any, R = any>(
  //     zodSchema: T,
  //     service: (param: z.output<T>, write: WriteFunc) => Promise<R>,
  //   ): RegisterableProcedure<'POSTSSE', T, R> =>
  //   (rs: RouterServer, path: string) =>
  //     rs.sse(path, zodSchema, service),

  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  sse: createSseMethod('sse'),
};

// prettier-ignore
export type ReplaceSpecificLeaf<T> = 
  T extends { $Number: unknown } ? { [k: number]: ReplaceSpecificLeaf<T['$Number']> } :
  T extends { $String: unknown } ? { [k: string]: ReplaceSpecificLeaf<T['$String']> } :

  // T extends ProcedureDef<"GET"> ? { get: NonNullable<T["func"]> } :
  // T extends ProcedureDef<"POST"> ? { post: NonNullable<T["func"]> } :
  T extends ProcedureDef<infer M> ? { [K in Lowercase<M & string>]: NonNullable<T["func"]> } :

  IsPlainObject<T> extends true ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> } : T;

// 判断是否为 普通对象, 排除数组/函数/基本数据类型
type IsPlainObject<T> = T extends object ? (T extends readonly any[] ? false : true) : false;
