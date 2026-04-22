import { Api } from '@/api';
import { ChatContext, type Context } from '@packages/gpt';
import { throttle } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

export const useChatContext = () => {
  const [context, setContext] = useState<Context[]>([]);
  const [loading, setLoading] = useState(false);

  const chatContext = useRef(new ChatContext());

  useEffect(() => {
    chatContext.current.setSystem(
      'u are an intriguing and fascinating girl',
      // 'You are a girl who despises me greatly, but still needs to maintain politeness',
      // '你是个希望与我保持距离的女孩，你又要保持礼貌，保持距离不想多说什么，怕自己说多了让对方误会觉得你在给机会，保持朋友距离就好，冷处理，话题终结者'
      // '你是个超级编程助理，帮我分析代码问题',
    );
    setContext(chatContext.current.jsonContext());
  }, []);

  const sendMessage = async (message: string) => {
    chatContext.current.context.add('user', message);
    setContext(chatContext.current.jsonContext());
    await retry();
  };

  const retry = async () => {
    // todo 等待第一次回应要有 ~~loading~~ thinking
    setLoading(true);

    const { systemInstruction, contents } = chatContext.current.toGemini();
    const sse = Api.gpt.chat.gemini.sse({
      systemInstruction,
      contents,
      generationConfig: {},
    });
    /* const sse = Api.gpt.chat.glm.sse({
      model: 'glm-5-turbo',
      messages: chatContext.current.json(),
      thinking: {
        type: 'enabled',
      },
    }); */
    /* const sse = Api.gpt.chat.deepseek.sse({
      model: 'deepseek-reasoner',
      messages: chatContext.current.json(),
      thinking: {
        type: 'enabled',
      },
    }); */

    // todo 封装起来
    let _setContent: ReturnType<typeof chatContext.current.context.add>;
    const setContent: typeof _setContent = (data, isThinking) => {
      if (!_setContent) {
        _setContent = throttle(chatContext.current.context.add('assistant', ''), 50);
        setLoading(false);
      }
      _setContent(data, isThinking);
    };
    let thinking = '';
    let content = '';

    try {
      await sse(data => {
        // console.log(JSON.parse(data.data));
        // return;
        if (data.event === 'thinking') {
          thinking += JSON.parse(data.data);
          setContent(thinking, true);
        } else if (data.event === 'content') {
          content += JSON.parse(data.data);
          setContent(content);
        } else {
          console.log(data);
        }
        setContext(chatContext.current.jsonContext());
      });
    } catch (error) {
      setLoading(false);
    }
  };

  return {
    loading,
    context,
    sendMessage,
    retry,
  };
};
