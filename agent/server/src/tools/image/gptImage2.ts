import z from 'zod';
import { wrapperSSEStream } from '@packages/gpt';
import { procedure } from '@packages/tsrouter/server';
import { jsonRequest } from '@packages/utils';

const grsaiGptImage2Schema = z.object({
  model: z.enum(['gpt-image-2', 'gpt-image-2-vip']).optional().default('gpt-image-2'),
  prompt: z.string(),
});

export const grsaiGptImage2Router = procedure.sse(grsaiGptImage2Schema, async ({ model, prompt }, { write, signal }) => {
  const response = await jsonRequest({
    method: 'POST',
    baseUrl: 'https://grsai.dakka.com.cn',
    url: '/v1/draw/completions',
    headers: new Headers({
      Authorization: `Bearer ${process.env.GRSAI_API_KEY}`,
    }),
    body: {
      model,
      prompt,
    },
    signal,
  });

  await wrapperSSEStream<Progress>(response, async streamJsons => {
    for (const data of streamJsons) {
      if (data.error) await write(data.error, 'error');
      if (data.progress) await write(`${data.progress}`, 'progress');
      if (data.results?.length) await write(JSON.stringify(data.results), 'results');
    }
  });
});

// Doc https://grsai.com/zh/dashboard/documents/gpt-image
// export const grsaiGptImage2Router = procedure.sse()

type Progress = {
  id: string;
  task_id: '';
  url: '';
  width: number;
  height: number;
  /** 进度百分比 1~100 */
  progress: number;
  status: 'running';
  failure_reason?: string;
  error?: string;
  results:
    | {
        url: string;
        width: number;
        height: number;
      }[]
    | null;
  callback_url: '';
  start_time: number;
  end_time: number;
};
