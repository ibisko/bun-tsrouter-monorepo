import { procedure } from '@packages/tsrouter/server';
import z from 'zod';
import { UserIntent } from '@/agents/UserIntent';

/**
 * 单用户，如果想多用户那就另外再套一层吧
 * todo 支持在过程中发送user信息来及时变化
 * todo 自动取消agent任务，注册有个singal
 */

// 执行一个对话任务，直到完成，然后跳出
// async loop() {
// todo 拿到content、tools
// todo 回复tools
// todo 意图选择器，开启 sub agent (可选await，开启常驻agent)
//      todo 常驻 agent 有唯一 AgentID+SessionID
/**
 * agent 分类
 * - 常驻单例
 * - 后台任务
 */

const sessionSchema = z.object({
  sessionId: z.number().optional(),
});

const chatSchema = sessionSchema.extend({
  text: z.string(),
  sources: z.array(z.any()).optional(),
  pid: z.number().optional(),
});

// 发送user消息
export const sendMessageRouter = procedure.post(chatSchema, async ({ sessionId, text, sources, pid }) => {
  const ui = new UserIntent();
  await ui.sendMessage({ text, sessionId, sources, pid });
});

// todo 先不考虑监听恢复吧，因为这不会涉及到原流程的变动
// 触发并监听任务，那就纯粹是监听吧
procedure.sse(sessionSchema, async ({ sessionId }, { write, signal, ctx }) => {
  //   createGptServices(
  //     glmRequestSchema,
  //   );
});

// todo 用新的 user-meesage 来新建 session ?
