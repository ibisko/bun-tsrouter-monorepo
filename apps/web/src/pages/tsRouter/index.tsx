import { RestApi } from './RestApi';
import { TestSSE } from './TestSSE';

const TsRouterPage = () => {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div>TsRouter 模块的单元测试</div>
      <div>Rest Api 单元测试</div>
      <RestApi />
      <div>SSE Api 单元测试</div>
      <TestSSE />
    </div>
  );
};

export default TsRouterPage;
