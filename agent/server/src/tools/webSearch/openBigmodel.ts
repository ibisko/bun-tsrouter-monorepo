import z from 'zod';
import { procedure } from '@packages/tsrouter/server';
import { jsonRequest } from '@packages/utils';

export const openBigModelWebSearchSchema = z.object({
  search: z.string().max(70).describe('搜索内容'),
  search_engine: z
    .enum(['search_std', 'search_pro', 'search_pro_sogou', 'search_pro_quark'])
    .optional()
    .default('search_pro_quark')
    .describe('搜索类型，忽略即可'),
});

export const openBigModelWebSearch = async ({ search, search_engine }: z.input<typeof openBigModelWebSearchSchema>) => {
  const response = await jsonRequest({
    method: 'POST',
    baseUrl: 'https://open.bigmodel.cn',
    url: '/api/paas/v4/web_search',
    headers: new Headers({
      Authorization: `Bearer ${process.env.GLM_API_KEY}`,
    }),
    body: {
      search_query: search,
      search_engine,
      search_intent: true,
    },
  });
  return response.json() as Promise<WebSearchResponse>;
};

export const openBigModelWebSearchRouter = procedure.post(openBigModelWebSearchSchema, openBigModelWebSearch);

type WebSearchResponse = {
  created: number;
  id: string;
  request_id: string;
  search_intent: {
    intent: 'SEARCH_ALL';
    keywords: string;
    query: string;
  }[];
  search_result: {
    content: string;
    icon: string;
    link: string;
    media: string;
    publish_date: string;
    refer: `ref_${number}`;
    title: string;
  }[];
};
