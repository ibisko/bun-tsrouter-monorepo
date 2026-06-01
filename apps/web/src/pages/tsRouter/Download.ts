import { Api } from '@/api';

export const downlaodTest1 = async () => {
  const response = await Api.test.tsRouter.download.download({ fileName: 'package.json' });
  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
  if (!reader) return;
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    if (typeof value !== 'string') throw new Error('返回结果不是字符串');
  }
};

export const downlaodTest2 = async () => {
  try {
    await Api.test.tsRouter.download.download({ fileName: 'package2.json' });
  } catch {
    return;
  }
  throw new Error('期望应该失败的');
};
