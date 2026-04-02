import z from 'zod';
import { chatRequest } from '@/utils/gpt';
import { procedure } from '@packages/tsrouter/server';
import { readPromptFile } from '@/utils/prompt';

export const chatSchema = z.object({
  text: z.string(),
});
export const chatSse = procedure.sse(chatSchema, async ({ text }, { write, signal }) => {
  const content = await readPromptFile('./toSkill.md');
  const response = await chatRequest(
    {
      model: 'glm-5',
      // model: 'GLM-4.7',
      messages: [
        {
          role: 'system',
          content: content,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 1.0,
      thinking: {
        // type: 'enabled',
        type: 'disabled',
      },
      stream: true,
    },
    signal,
  );

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('没有reader');
  }

  do {
    const { done, value } = await reader.read();
    if (done) break;
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(value, { stream: true }).trim();
    write(str);
  } while (true);
});
