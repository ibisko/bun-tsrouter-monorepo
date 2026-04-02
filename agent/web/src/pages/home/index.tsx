import { Api } from '@/api';
import { MonacoEditor } from '@/components/editor';
import { Button, Textarea } from '@packages/ui';
import { useState } from 'react';

const HomePage = () => {
  const [reasoningContent, setReasoningContent] = useState('');
  const [content, setContent] = useState('');
  const [sendContet, setSendContent] = useState('');

  const postChat = async () => {
    const cb = Api.gpt.chat.chat.sse({ text: sendContet });
    setSendContent('');
    let cacheReasoningContent = '';
    let cacheContent = '';
    await cb(({ data }: { data: string }) => {
      const items = data.split('\n').filter(item => !!item);
      let reasoning_content = '';
      let content = '';
      for (const item of items) {
        let strdata = item;
        const data = /^data:\s+(.*)/.exec(item);
        if (data) {
          // console.log('no data:', data);
          strdata = data[1]!;
        }
        if (strdata === '[DONE]') break;
        let res;
        try {
          res = JSON.parse(strdata) as StreamResponse;
        } catch (error) {
          console.log('Error:', error);
          console.log('Error strdata:', strdata);
          continue;
        }
        for (const chiocs of res.choices) {
          if (chiocs.delta.reasoning_content) {
            reasoning_content += chiocs.delta.reasoning_content;
          }
          if (chiocs.delta.content) {
            content += chiocs.delta.content;
          }
        }
      }
      cacheReasoningContent += reasoning_content;
      cacheContent += content;
      setReasoningContent(cacheReasoningContent);
      setContent(cacheContent);
      // console.log({ reasoning_content, content });
    });
    console.log({ cacheReasoningContent, cacheContent });
  };

  return (
    <div className="relative flex flex-col gap-4 p-4 h-screen">
      {reasoningContent && (
        <pre className="flex flex-col flex-1 gap-2 w-full overflow-auto">
          <code className="border p-2 rounded-2xl">{reasoningContent}</code>
        </pre>
      )}
      <div className="h-full text-xs overflow-hidden">
        <div className="flex gap-4 items-center">
          <div className="ml-auto">text.length: {content.length}</div>
          <Button>copy</Button>
        </div>
        <MonacoEditor className="" content={content} language="markdown" />
      </div>
      <Textarea className="" value={sendContet} onChange={e => setSendContent(e.target.value)} rows={8} />
      <Button onClick={postChat}>post</Button>
    </div>
  );
};

export default HomePage;

type StreamResponse = {
  id: string;
  object: string; // chat.completion.chunk
  created: number; // 1772685335
  model: 'glm-5';
  choices: [
    {
      index: 0;
      delta: {
        role: string; // assistant
        reasoning_content: string; // 思考内容
        content: string; // 回答内容
      };
      logprobs: null;
      finish_reason: null;
    },
  ];
};
