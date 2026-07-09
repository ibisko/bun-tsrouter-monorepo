import z from 'zod';

export const skipTaskTableSchema = z.object({
  skip: z.coerce.number().default(0),
  take: z.coerce.number().default(20),
});
