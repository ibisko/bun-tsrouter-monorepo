import agentTools from '@/agents/core/agentTools';
import { geminiWebSearch, geminiWebSearchRouter } from './gemini';
import { openBigModelWebSearch, openBigModelWebSearchRouter, openBigModelWebSearchSchema } from './openBigmodel';
import z from 'zod';
import { ToolKey } from '@/common/tools';

export const webSearchRouter = {
  openBigModel: openBigModelWebSearchRouter,
  gemini: geminiWebSearchRouter,
};

const webSearchSchema = z.object({
  search: z.string(),
});

// const tool = createTool({ name: 'WEBSEARCH', description: '联网搜索', parameters: webSearchSchema });
// console.log(tool);

/** 多平台联网搜索 */
// todo 查询组合式
// todo 查询分类
// todo 响应结构统一？
//      todo 非统一响应结构，则回传给llm就是总结好的吧，gemini就已经总结好了的
//      todo 非统一响应结构，openbigmodel就是没有总结好
const webSearch = async ({ search }: z.output<typeof webSearchSchema>) => {
  // open big model
  // const res = await openBigModelWebSearch({ search });
  // gemini
  const res = await geminiWebSearch({ search, model: 'gemini-3.5-flash' });
  return res;
};

agentTools.set(ToolKey.WebSearch, {
  description: '联网搜索',
  schema: webSearchSchema,
  func: webSearch,
});
