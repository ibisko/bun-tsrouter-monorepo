const BASE_URL = process.env.GML_CODING_PLAN_BASE_URL;
const API_KEY = process.env.GML_CODING_PLAN_API_KEY;

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

export const chatRequest = async (param: any, signal: AbortSignal) => {
  const body = JSON.stringify(param);

  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: API_KEY,
  });

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body,
    signal,
  });
  if (!response.ok) {
    console.log(response.status);
    const errmessage = await response.text();
    console.log(errmessage);
    throw new Error(errmessage);
  }
  return response;
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
