import { Api } from '@/api';
import { ResponseError } from '@packages/tsrouter/client';

export const TestPutFile1 = async () => {
  const content = 'abcdefg';
  const file = new File([content], 'demo.text');
  await Api.test.tsRouter.putFile1.putFile(file, {
    headers: {
      'X-FileName': file.name,
    },
  });
};

export const TestPutFile2 = async () => {
  const content = 'abcdefg';
  const file = new File([content], 'demo.text');
  try {
    await Api.test.tsRouter.putFile1.putFile(file);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.message === 'no fileName') return;
    }
  }
  throw new Error('预期失败');
};
