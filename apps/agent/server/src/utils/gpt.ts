const BASE_URL = 'https://open.bigmodel.cn/api/coding/paas/v4/chat/completions';
const API_KEY = 'ab7d41675116438d91cac12ebfbc788c.gE2B42cLw3haZ380';

const parseValue = (value: Uint8Array<ArrayBuffer>) => {
  const decoder = new TextDecoder('utf-8');
  const str = decoder.decode(value, { stream: true }).trim();
  const items = str.split('\n').filter(item => !!item);

  let reasoning_content = '';
  let content = '';
  for (const item of items) {
    const data = /^data:\s+(.*)/.exec(item);
    if (!data) {
      console.log('no data:', str);
      continue;
    }
    const strdata = data[1]!;
    if (strdata === '[DONE]') break;
    try {
      const res = JSON.parse(strdata) as StreamResponse;
      for (const chiocs of res?.choices) {
        if (chiocs.delta.reasoning_content) {
          reasoning_content += chiocs.delta.reasoning_content;
        }
        if (chiocs.delta.content) {
          content += chiocs.delta.content;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return { reasoning_content, content };
};

const chat = async (param: any) => {
  const body = JSON.stringify(param);

  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: API_KEY,
  });

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) {
    console.log(response.status);
    const errmessage = await response.text();
    console.log(errmessage);
    throw new Error(errmessage);
  }
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('没有reader');
  }

  let reasoning_content = '',
    content = '';
  do {
    const { done, value } = await reader.read();
    if (done) break;
    const parseContent = parseValue(value);
    reasoning_content += parseContent.reasoning_content;
    content += parseContent.content;
  } while (true);
  return { reasoning_content, content };
};

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

async function main() {
  const res = await chat({
    model: 'glm-5',
    messages: [
      {
        role: 'system',
        content: '你是一个有用的AI助手。',
      },
      {
        role: 'user',
        content: '你好，请介绍一下自己。',
      },
    ],
    temperature: 1.0,
    stream: true,
  });
  console.log('reasoning_content:', res.reasoning_content);
  console.log('content:', res.content);
}
main();
