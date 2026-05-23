import { yydsGptRouter, glmGptRouter, deepseekGptRouter, kimiGptRouter, xiaomiGptRouter } from './gpt';
import { geminiChatRouter } from './gemini';
import { glmAnthropicRouter } from './anthropic';

export const llmRouter = {
  gpt: {
    glm: glmGptRouter,
    deepseek: deepseekGptRouter,
    gemini: geminiChatRouter,
    kimi: kimiGptRouter,
    yyds: yydsGptRouter,
    xiaomi: xiaomiGptRouter,
  },
  anthropic: {
    glm: glmAnthropicRouter,
  },
};
