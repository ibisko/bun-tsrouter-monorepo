import { wrapperSSEStream } from '@packages/gpt';
import { procedure } from '@packages/tsrouter/server';
import { jsonRequest } from '@packages/utils';
import z from 'zod';

const grsaiNanobananSchema = z.object({
  model: z.enum([
    'nano-banana-2',
    'nano-banana-2-cl',
    'nano-banana-2-4k-cl',
    'nano-banana-fast',
    'nano-banana',
    'nano-banana-pro',
    'nano-banana-pro-vt',
    'nano-banana-pro-cl',
    'nano-banana-pro-vip',
    'nano-banana-pro-4k-vip',
  ]),
  prompt: z.string(),
});

export const grsaiNanobanaaRouter = procedure.sse(grsaiNanobananSchema, async ({ model, prompt }, { write, signal }) => {
  const response = await jsonRequest({
    method: 'POST',
    baseUrl: 'https://grsai.dakka.com.cn',
    url: '/v1/draw/nano-banana',
    headers: new Headers({
      Authorization: `Bearer ${process.env.GRSAI_API_KEY}`,
    }),
    body: {
      model,
      prompt,
    },
    signal,
  });

  await wrapperSSEStream<Progress>(response, async streamJson => {
    for (const item of streamJson) {
      if (item.error) {
        await write(item.error, 'error');
      }
      if (item.progress) {
        await write(`${item.progress}`, 'progress');
      }
      if (item.results?.length) {
        await write(JSON.stringify(item.results), 'results');
      }
    }
  });
});

type Progress = {
  id: string;
  results: { url: string; content: string }[];
  progress: number;
  status: 'succeeded';
  failure_reason?: 'output_moderation';
  error?: string;
  callback_url: '';
  start_time: number;
  end_time: number;
};
