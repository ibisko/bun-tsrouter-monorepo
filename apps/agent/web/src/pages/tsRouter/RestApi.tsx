import { useEffect, useState } from 'react';
import { Status } from './Status';
import { TestCard } from './TestCard';
import { Api } from '@/api';

export const RestApi = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <TestCard
        title="Test-RestApi get1"
        description={
          <>
            <div>无参数</div>
            <div>{'Api.test.tsRouter.get1.get()'}</div>
          </>
        }>
        <ModuleRestApi
          fetch={() => Api.test.tsRouter.get1.get()}
          rule={response => {
            if (response.msg !== 'Get(1) not params') {
              throw new Error();
            }
          }}
        />
      </TestCard>

      <TestCard
        title="Test-RestApi get2"
        description={
          <>
            <div>有参数</div>
            <div>{"Api.test.tsRouter.get2.get({ id: 12, name: 'huhuhu' })"}</div>
          </>
        }>
        <ModuleRestApi
          fetch={() => Api.test.tsRouter.get2.get({ id: 12, name: 'huhuhu' })}
          rule={response => {
            if (response.id !== 12) {
              throw new Error();
            }
            if (response.name !== 'huhuhu') {
              throw new Error();
            }
          }}
        />
      </TestCard>
    </div>
  );
};

type ModuleRestApiProps = {
  fetch: () => Promise<unknown>;
  rule: (res: any) => Promise<void> | void;
};
export const ModuleRestApi = ({ fetch, rule }: ModuleRestApiProps) => {
  const [status, setStatus] = useState<'ok' | 'failed' | ''>('');

  const start = async () => {
    try {
      const response = await fetch();
      await rule(response);
      setStatus('ok');
    } catch (error) {
      setStatus('failed');
    }
  };
  useEffect(() => {
    start();
  }, []);

  return <Status status={status} />;
};
