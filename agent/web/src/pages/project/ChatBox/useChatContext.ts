import { Api } from '@/api';
import { ChatContext, GPT, MessageType, type Context } from '@packages/gpt';
import { ResponseError } from '@packages/tsrouter/client';
import { throttle } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const useChatContext = () => {
  const [context, setContext] = useState<Context[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContext = useRef(new ChatContext());

  useEffect(() => {
    //     chatContext.current.setSystem(
    //       /* `当前时间是: ${new Date().toLocaleString()}

    // 你仅负责分析用户的意图，理解用户消息意图是否足够清楚

    // 如果足够清楚就返回格式

    // \`\`\`ts
    // type Response = {
    //   type: 'clear';
    //   query: string; // 可以稍微完善下用户的需求，但不要脱离用户需求的范围，最小边界
    //   confidence: number; // 0~1 当前意图的置信度
    // };
    // \`\`\`

    // 如果不够清晰那就猜测用户具体的意图会是什么，最多给出5条猜测，并给出置信度 confidence
    // 返回格式为

    // \`\`\`ts
    // type Response = {
    //   type: 'try_understand';
    //   querys: {
    //     query: string;
    //     confidence: number; // 0~1 置信度低于 0.85 就不要
    //   }[];
    // };
    // \`\`\`

    // 注意返回内容是要中文
    // 如果存在专业术语的词汇，就保持原来的`, */
    //       // 'u are an intriguing and fascinating girl',
    //       // '你是个超级编程助理，提供最小解决问题的精简思路，如有必要可以帮我分析代码问题',
    //     );

    setContext(chatContext.current.jsonContext());
  }, []);

  const sendMessage = async (message: string) => {
    chatContext.current.context.add(GPT.Role.User, message);
    setContext(chatContext.current.jsonContext());
    await streamChatResponse({ chatContext: chatContext.current, setContext, setLoading });
  };

  const retry = async (id: number) => {
    chatContext.current.context.truncateFrom(id);
    setContext(chatContext.current.jsonContext());
    await streamChatResponse({ chatContext: chatContext.current, setContext, setLoading });
  };

  const output = () => {
    console.log(chatContext.current.context.context);
  };

  return {
    loading,
    context,
    sendMessage,
    retry,
    output,
  };
};

type HandleParms = {
  setLoading: (loading: boolean) => void;
  setContext: (contexts: Context[]) => void;
  chatContext: ChatContext;
};

const streamChatResponse = async ({ chatContext, setContext, setLoading }: HandleParms) => {
  setLoading(true);

  let thinking = '';
  let content = '';

  let throttledUpdate: ReturnType<typeof chatContext.context.add>;
  const setContent: typeof throttledUpdate = (data, isThinking) => {
    if (!throttledUpdate) {
      const __ss = chatContext.context.add(GPT.Role.Assistant, '');
      throttledUpdate = throttle((...param: Parameters<typeof __ss>) => {
        __ss(...param);
        setContext(chatContext.jsonContext());
      }, 50);
    }
    throttledUpdate(data, isThinking);
  };

  try {
    /* const sse = await Api.llm.gpt.gemini.sse({
      ...chatContext.toGemini(),
      generationConfig: {},
    }); */

    /* const sse = await Api.llm.gpt.yyds.sse({
      ...chatContext.json(),
    }); */

    /* const sse = await Api.llm.gpt.deepseek.sse({
      ...chatContext.json(),
      thinking: true,
    }); */

    /* const sse = await Api.llm.gpt.glm.sse({
      ...chatContext.json(),
      thinking: true,
    }); */

    const sse = await Api.llm.anthropic.glm.sse({
      thinking: true,
      ...chatContext.toAnthropic(),
    });

    await sse<string>(data => {
      setLoading(false);
      if (data.event === MessageType.Thinking) {
        thinking += data.data;
        setContent(thinking, true);
      } else if (data.event === MessageType.Content) {
        content += data.data;
        setContent(content);
      } else {
        console.log(data);
      }
    });
  } catch (error) {
    console.log('sse error', error, typeof error, error instanceof Error, error instanceof ResponseError);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};
