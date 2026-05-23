import { imageRouter } from './image';
import { webSearchRouter } from './webSearch';

export const toolsRouter = {
  webSearch: webSearchRouter,
  image: imageRouter,
};

/**
 * # 基础 tools
 *
 * - web search
 *   - npm package info
 * - web fetch
 * - fs file
 *   - read
 *   - write new file
 *   - editor file
 *   - delete
 * - dir file tree
 *   - package block
 *   - global search file content
 * - git?
 *   - workflow?
 *
 * # 决策展示
 *
 * - sub agent running
 * - ask user
 *   - 意图询问
 *   - 提供方案选择路线
 *   - plan mode 计划模式
 *
 * # 扩展功能tools
 *
 * - generate image
 * - tts
 * -
 */
