import type { FastifyInstance } from 'fastify';
import type { RestApiService, RouterServerOptions, SseService } from '../type';
import type { ZodObject } from 'zod';

export interface RouterServerInterface {
  fastify: FastifyInstance;
  formatLogger: RouterServerOptions['formatLogger'];
}

export type RouterServerRestApiParam = {
  path: string | string[];
  zodSchema?: ZodObject;
  service: RestApiService<any>;
};

export type RouterServerSseParam = {
  path: string | string[];
  zodSchema?: ZodObject;
  service: SseService<any>;
};
