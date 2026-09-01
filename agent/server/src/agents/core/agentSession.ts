import prisma from '@/database/prisma';
import { GPT } from '@packages/gpt';
import { ServiceError } from '@packages/tsrouter/server';
import { type Prisma } from '@prisma/generated/client';

/**
 * 仅负责状态
 */
export class AgentSession {
  static runningSessionId = new Set<number>();

  public messages: GPT.Message[] = [];
  public sessionId?: number;
  private umid: number = 0;
  private agentMessageId: number | null = null;

  /** 补充会话 */
  async supplementary({ sessionId, text, sources }: SupplementarySessionParam) {
    if (this.sessionId && AgentSession.runningSessionId.has(this.sessionId)) {
      // todo 运行时追加用户Message，可能没有指定 agentMessageId ，未知怎么处理合适
      throw new Error('运行时追加用户Message，可能没有指定 agentMessageId ，未知怎么处理合适');
    }

    const _session = await prisma.sessions.findFirst({ where: { id: sessionId } });
    if (!_session) throw new ServiceError({ message: 'sessionId 不存在对应的 session id' });
    this.sessionId = sessionId;

    const message = await prisma.userMessages.create({
      data: { pid: _session.latest_umid, content: text, sources },
    });

    const session = await prisma.sessions.update({
      where: { id: this.sessionId },
      data: { latest_umid: message.id },
    });

    this.umid = session.latest_umid;
    AgentSession.runningSessionId.add(this.sessionId);

    const userMessages = await prisma.userMessages.findMany({});
    // todo 根据pid的溯源查询，未验证返回结果

    const chain = await prisma.$queryRaw`
      WITH RECURSIVE chain AS (
        SELECT * FROM UserMessages WHERE id = ${this.umid}
        UNION ALL
        SELECT m.* FROM UserMessages m JOIN chain c ON m.id = c.pid
      )
      SELECT * FROM chain ORDER BY id ASC
    `;
    console.log('chain', chain);

    this.messages = userMessages.map(item => {
      const userMessage: GPT.Message = {
        role: GPT.Role.User,
        content: [{ type: 'text', text: item.content }],
      };
      if (item.sources) userMessage.content.push(...sourcesToGptContent(item.sources as SourceItem[]));
      return userMessage;
    });
  }

  /** 创建会话 */
  async createSession({ text, sources }: CreateSessionParam) {
    const message = await prisma.userMessages.create({
      data: { content: text, sources },
    });
    const session = await prisma.sessions.create({
      data: { title: '', latest_umid: message.id },
    });
    this.umid = session.latest_umid;
    this.sessionId = session.id;
    this.messages.push({ role: GPT.Role.User, content: [{ type: 'text', text }] });
    AgentSession.runningSessionId.add(this.sessionId);
  }

  /** 切分会话 */
  async splitByPid({ pid, text, sources }: AgentSessionSplitByPid) {
    const _message = await prisma.userMessages.findFirst({ where: { id: pid } });
    if (!_message) throw new ServiceError({ message: 'pid 不存在对应的 message id' });
    // todo 如果是任务过程中追加 user message 呢？这时候 pid 就自然是 user 了，所以还需要判断下 session 是否正在有任务？
    const message = await prisma.userMessages.create({
      data: { pid, content: text, sources },
    });
    const session = await prisma.sessions.create({
      data: { title: '', latest_umid: message.id },
    });
    this.umid = session.latest_umid;
    this.sessionId = session.id;
    // todo message
  }

  /** 追加缓存内容 */
  // todo 参数指定还是用 text, sources 合适些
  async append(params: Pick<Prisma.AgentMessagesCreateArgs['data'], 'pid' | 'role' | 'content' | 'metadata' | 'agent_type'>) {
    if (!this.sessionId) return;
    if (!AgentSession.runningSessionId.has(this.sessionId)) {
      // throw new Error();
      console.log('session 都结束了，还在加');
      return;
    }
    const pid = params.pid || this.agentMessageId;
    const am = await prisma.agentMessages.create({
      data: {
        pid: pid,
        role: params.role,
        content: params.content, // 上下文信息
        metadata: params.metadata, // 不参与上下文的信息
        agent_type: params.agent_type, // 当前消息是哪个agent执行的
        umid: this.umid,
      },
    });
    this.agentMessageId = am.id;
    this.messages.push({ role: params.role as GPT.Role, content: params.content } as GPT.Message);
  }

  end() {
    if (!this.sessionId) return;
    AgentSession.runningSessionId.delete(this.sessionId);
  }
}

export type SourceItem = {
  type: 'image' | 'file' | 'video';
  url: string;
};

type CreateSessionParam = {
  text: string;
  sources?: SourceItem[];
};

type SupplementarySessionParam = CreateSessionParam & {
  sessionId: number;
};

type AgentSessionSplitByPid = CreateSessionParam & {
  pid: number;
};

type AppendParam = CreateSessionParam & {
  pid: number;
  role: GPT.Role;
  metadata: any;
  agentType: any;
};

const sourcesToGptContent = (sources: SourceItem[]) => {
  return sources.map(s => {
    if (s.type === 'file') return { type: 'file_url', file_url: { url: s.url } };
    else if (s.type === 'image') return { type: 'image_url', image_url: { url: s.url } };
    else if (s.type === 'video') return { type: 'video_url', video_url: { url: s.url } };
  }) as GPT.MessageUserContent[];
};
