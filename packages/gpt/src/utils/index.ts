import z from 'zod';
import { pick } from 'lodash-es';
import { Context, Tool } from '@/types';

/** 添加工具 */
export const createTool = ({ name, description, parameters }: AddTool): Tool => ({
  type: 'function',
  function: {
    name,
    description,
    parameters: pick(
      parameters.toJSONSchema({
        target: 'openapi-3.0',
        io: 'input',
      }),
      ['type', 'properties'],
    ),
  },
});

export type AddTool = {
  name: string;
  description: string;
  parameters: z.ZodObject;
};
