import { Api } from '@/api';
import { Button, Input } from '@packages/ui';
import { useRef } from 'react';
import { ResponseError } from '@packages/tsrouter/client';
import { hashFile } from '@/utils/file';
import { TestCard } from './TestCard';

// todo 自动分片上传，自动整合
export const UploadFile = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    const file = inputRef.current?.files?.item(0);
    if (!file) return;

    const hash = await hashFile(file);
    const formData = new FormData();
    formData.append('hash', hash);
    formData.append('file', file);

    try {
      const res = await Api.test.tsRouter.upload1.uploadFile(formData, {
        onPercent(percent) {
          console.log('上传进度', percent);
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        console.log('error.message:', error.message);
        console.log('error.status:', error.status);
      }
    }
  };

  return (
    <div className="flex">
      <TestCard title="uploadFile(1)" description="文件&le;5MB 直接单次上传">
        <div className="flex gap-4">
          <Input ref={inputRef} type="file" />
          <Button onClick={upload}>Upload</Button>
        </div>
      </TestCard>
    </div>
  );
};
