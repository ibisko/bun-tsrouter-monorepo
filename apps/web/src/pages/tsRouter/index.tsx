import { createLazyRoute } from '@tanstack/react-router';
import { sseTest1, sseTest2, sseTest3, sseTest4 } from './TestSSE';
import { postFormDataTest1, postFormDataTest2, postFormDataTest3 } from './TestPostFormData';
import { useTestModules } from './useTestModules';
import { useEffect } from 'react';
import { TestModulesTable } from './TestModulesTable';
import { restApiTest1, restApiTest2 } from './RestApi';
import { downlaodTest1, downlaodTest2 } from './Download';
import { TestPutFile1, TestPutFile2 } from './TestPutFile';

// todo 根据接口返回的信息来动态映射dom接口，以便只在后端写就好了

const TsRouterPage = () => {
  const { modules, setModule } = useTestModules();

  const initial = async () => {
    // rest api
    setModule('RestApi', '无请求参数，正常获取结果', restApiTest1);
    setModule('RestApi', 'server失败响应', restApiTest2);

    // postFormData
    setModule('PostFormData', '正常获取结果', postFormDataTest1);
    setModule('PostFormData', 'server响应错误', postFormDataTest2);
    setModule('PostFormData', 'formdata含file上传', postFormDataTest3);

    // sse
    setModule('SSE', '正常获取结果', sseTest1);
    setModule('SSE', '连接上就断开', sseTest2);
    setModule('SSE', '响应过程，server发生错误', sseTest3);
    setModule('SSE', '响应过程，突然web中断', sseTest4);

    // todo putFile
    setModule('PutFile', '上传文件', TestPutFile1);
    setModule('PutFile', '上传文件server发生错误', TestPutFile2);

    // download
    setModule('Downlad', '测试下载 package.json', downlaodTest1);
    setModule('Downlad', '测试错误下载 package2.json', downlaodTest2);
  };

  useEffect(() => {
    initial();
  }, []);

  return (
    <div className="flex">
      <TestModulesTable className="m-2 p-4 rounded-2xl border" modules={modules} />
    </div>
  );
};

export const Route = createLazyRoute('/app/ts-router')({
  component: TsRouterPage,
});
