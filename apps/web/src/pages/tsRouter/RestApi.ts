import { Api } from '@/api';

export const restApiTest1 = async () => {
  await Api.test.tsRouter.get1.get();
};

export const restApiTest2 = async () => {
  try {
    await Api.test.tsRouter.get2.get({ id: 1, name: 'nnhu' });
  } catch {
    return;
  }
  throw new Error('期望应该失败的');
};
