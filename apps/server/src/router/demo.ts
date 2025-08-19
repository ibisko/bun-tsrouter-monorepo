import { demoService, zodDemoSchema } from '@/services/demo/index.js';
import { FastifyInstance } from 'fastify';
import { createRouter, procedure } from './demoTrpc.js';

export const demorouter = {
  demo: {
    aa: procedure.get(zodDemoSchema, demoService),
  },
  aa: {
    bb: {
      cc: procedure.post(zodDemoSchema, demoService),
    },
  },
};

export const demoAppRouter = (fastify: FastifyInstance) => createRouter(fastify, demorouter);
