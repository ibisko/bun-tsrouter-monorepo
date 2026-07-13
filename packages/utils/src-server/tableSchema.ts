import z from 'zod';

export const skipTaskTableSchema = z.object({
  skip: z.coerce.number().default(0),
  take: z.coerce.number().default(20),
});

type JsonObject = {
  [Key in string]?: JsonValue;
};
interface JsonArray extends Array<JsonValue> {}
type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

export const prismaJsonValueSchema: z.ZodType<JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.record(
    z.string(),
    z.lazy(() => prismaJsonValueSchema),
  ), // 递归对象
  z.array(z.lazy(() => prismaJsonValueSchema)), // 递归数组
]);
