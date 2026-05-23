import { geminiModel } from '@packages/gpt';
import { procedure } from '@packages/tsrouter/server';
import { jsonRequest } from '@packages/utils';
import { pick } from 'lodash-es';
import z from 'zod';

const webSearchSchema = z.object({
  search: z.string().max(70),
  model: geminiModel.optional().default('gemini-3-flash-preview'),
});

export const geminiWebSearch = async ({ search, model }: z.input<typeof webSearchSchema>) => {
  const response = await jsonRequest({
    method: 'POST',
    baseUrl: process.env.GEMINI_URL,
    url: `v1beta/models/${model}:generateContent`,
    headers: new Headers({ 'x-goog-api-key': process.env.GEMINI_API_KEY }),
    body: {
      contents: [{ parts: [{ text: search }] }],
      tools: [{ google_search: {} }],
    },
  });
  const res: WebSearchResponse = await response.json();
  const content = res.candidates
    .map(item => item.content.parts.map(item => item.text))
    .flat()
    .join('\n');

  const metadata = res.candidates.map(item => pick(item.groundingMetadata, 'groundingChunks', 'groundingSupports', 'webSearchQueries'));
  return { content, metadata };
};

export const geminiWebSearchRouter = procedure.post(webSearchSchema, geminiWebSearch);

type WebSearchResponse = {
  candidates: {
    content: {
      parts: { text: string }[];
    };
    groundingMetadata: {
      groundingChunks: {
        web: {
          uri: string;
          title: string;
        };
      }[];
      groundingSupports: {
        segment: {
          text: string;
        };
        /** 对应上面uri索引 */
        groundingChunkIndices: number[];
      }[];
      /** 搜索意图 */
      webSearchQueries: string[];
    };
  }[];
};
