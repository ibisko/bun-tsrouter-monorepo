import { Button } from '@packages/ui';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { appRouter } from './api';

function App() {
  const onClick = async () => {
    try {
      // const res = await appRouter.demo.aa.get({ id: 12, text: '21' });
      const res = await appRouter.aa.bb.cc.post({ id: 12, text: '21' });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={onClick}>count is</button>
        <Button className="bg-green-500">AAA</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
