import { createLazyRoute } from '@tanstack/react-router';
import { RestApi } from './RestApi';
import { TestSSE } from './TestSSE';
import { UploadFile } from './UploadFile';
import { SseCard } from './SseCard';
import { Api } from '@/api';

// todo 根据接口返回的信息来动态映射dom接口，以便只在后端写就好了

const TsRouterPage = () => {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div>TsRouter 模块的单元测试</div>
      <div>Rest Api 单元测试</div>
      <RestApi />
      <div>SSE Api 单元测试</div>
      <TestSSE />
      <div>Upload 单元测试</div>
      <UploadFile />
      <SseCard length={5} sseHandle={() => Api.test.tsRouter.sse1.sse({ id: 1, name: 'ksjkdl' })} />
    </div>
  );
};

export const Route = createLazyRoute('/app/ts-router')({
  component: TsRouterPage,
});
