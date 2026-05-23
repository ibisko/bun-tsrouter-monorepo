import { ChatContext } from '@packages/gpt';
import { nanoid } from '@packages/utils';

/**
 * agent 的接口包装定义，便于分化agent的定义
 *
 * 单用户，如果想多用户那就另外再套一层吧
 * todo 支持在过程中发送user信息来及时变化
 * todo 自动取消agent任务，注册有个singal
 */
export class AgentManages {
  private chatContext: Map<string, ChatContext> = new Map();
  private abortController = new AbortController();
  abort() {
    this.abortController.abort();
  }

  private createSession() {
    const sessionId = nanoid();
    this.chatContext.set(sessionId, new ChatContext());
    return sessionId;
  }

  //   bindSession() {
  //     return signal => {};
  //   }

  getContext(sessionId?: string) {
    if (!sessionId) {
      sessionId = this.createSession();
    }
    return this.chatContext.get(sessionId)!;
  }

  // 执行一个对话任务，直到完成，然后跳出
  async loop() {
    while (true) {
      // todo 拿到content、tools
      // todo 回复tools
      // todo 意图选择器，开启 sub agent (可选await，开启常驻agent)
      //      todo 常驻 agent 有唯一 AgentID+SessionID
      /**
       * agent 分类
       * - 常驻单例
       * - 后台任务
       */
      break;
    }
  }
}
