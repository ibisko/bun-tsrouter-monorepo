import { Api } from '@/api';
import { ResponseError } from '@packages/tsrouter/client';

export const postFormDataTest1 = async () => {
  const formData = new FormData();
  formData.append('name', 'nnhu');
  await Api.test.tsRouter.postFormData1.postFormData(formData);
};

export const postFormDataTest2 = async () => {
  try {
    const formData = new FormData();
    formData.append('name', 'nnhu2');
    await Api.test.tsRouter.postFormData1.postFormData(formData);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.message === 'name !== nnhu') return;
    }
  }
  throw new Error('预期发生错误');
};

export const postFormDataTest3 = async () => {
  const content = 'abcdefg1234567';
  const file = new File([content], 'demo-post-formdata-test3.text');
  const formData = new FormData();
  formData.append('file', file);
  const res = await Api.test.tsRouter.postFormDataFile.postFormData(formData);
  if (res.fileName !== file.name) throw new Error('返回文件名不对');
};
