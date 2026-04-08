import z from 'zod';

export const iconIncoSchema = z.object({
  key: z.string(),

  top: z.number(),
  left: z.number(),
  width: z.number(),
  height: z.number(),

  body: z.string(),
  prefix: z.string(),
  isAnimate: z.boolean().optional(),
});

export type IconInfo = z.output<typeof iconIncoSchema>;
