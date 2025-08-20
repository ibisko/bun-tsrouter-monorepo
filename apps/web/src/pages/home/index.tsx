import { Button } from '@packages/ui';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';
import { Api, ApiResponseError } from '@/api';
import { useNavigate } from 'react-router-dom';



const HomePage = () => {
  const navigate = useNavigate();

  const testDemoProxy = async () => {
    try {
      // console.log(await Api.aa.post.cc({ id: 12, text: '323' }));
      console.log(await Api.aa.post.cc.post({ id: 12, text: '323' }));
      // console.log(await Api.aa.post.cc.post({ id: 12 }));
      // console.log(await Api.aa.post.cc.post({ id: 12, text: 12 }));
      // console.log(await Api.aa.post({ id: 12, text: '21' }));
    } catch (error) {
      console.log(error);
      
      // if (error instanceof ApiResponseError) {
      //   console.log(error.response);
      // }
    }
    // console.log(Api.aa.post.cc({ id: 12, text: '21' }));
    // console.log(Api.aa.post.cc);
  };

  const fetchDemo = async () => {
    try {
      const res = await Api.demo.aa.get({ id: 12, text: '21' });
      // const res = await Api.aa.bb.cc.post({ id: 12, text: '21' });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="">
        <div className="font-bold">接口测试</div>
        <div className="flex gap-1">
          <Button className="" onClick={fetchDemo}>
            fetch demo get
          </Button>
          <Button className="" onClick={testDemoProxy}>
            test demo proxy
          </Button>
        </div>
      </div>

      <div className="">
        <div className="font-bold">路由测试</div>
        <div className="flex gap-1">
          <Button className="" onClick={() => navigate('/pg1')}>
            router to PG1
          </Button>
          <Button className="" onClick={() => navigate('/protected')}>
            router to protected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
