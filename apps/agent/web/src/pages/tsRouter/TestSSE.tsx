import { Api } from '@/api';
import { useEffect, useRef, useState } from 'react';
import { Status } from './Status';
import { TestCard } from './TestCard';

export const TestSSE = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <TestCard title="Test-SSE (sse1)" description="有参数">
        <ModuleSSE1
          sse={signal => Api.test.tsRouter.sse1.sse({ id: 12, name: 'huhuhu' }, { signal })}
          rule={(data, index) => {
            if (data.id !== index) {
              throw new Error();
            }
            const regexp = new RegExp(`i\\>\\: ${index}-eee id\\:12, name\\:huhuhu`);
            if (!regexp.test(data.data)) {
              throw new Error();
            }
          }}
        />
      </TestCard>

      <TestCard title="Test-SSE (sse2)" description="无参数">
        <ModuleSSE1
          sse={signal => Api.test.tsRouter.sse2.sse(null, { signal })}
          rule={(data, index) => {
            if (data.id !== index) {
              throw new Error();
            }
            const regexp = new RegExp(`i\\>\\: ${index}-eee Empty`);
            if (!regexp.test(data.data)) {
              throw new Error();
            }
          }}
        />
      </TestCard>

      <TestCard title="Test-SSE (sse3)" description="结构化返回">
        <ModuleSSE1
          sse={signal => Api.test.tsRouter.sse3.sse({ id: 12, name: 'jfklsd' }, { signal })}
          // rule={(data, index) => {
          //   if (data.id !== index) {
          //     throw new Error();
          //   }
          //   const regexp = new RegExp(`i\\>\\: ${index}-eee Empty`);
          //   if (!regexp.test(data.data)) {
          //     throw new Error();
          //   }
          // }}
        />
      </TestCard>
    </div>
  );
};

type ModuleSSE1Props = {
  sse: (signal: AbortSignal) => <K = any>(callback: (data: K) => void) => Promise<void>;
  rule?: (data: any, index: number) => Promise<void> | void;
};
const ModuleSSE1 = ({ sse, rule }: ModuleSSE1Props) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const [status, setStatus] = useState<'ok' | 'failed' | ''>('');
  const start = async () => {
    setStatus('');
    let index = 0;
    let isSuccess = true;
    abortControllerRef.current = new AbortController();
    await sse(abortControllerRef.current.signal)<{ id: number; data: string }>(async data => {
      try {
        await rule?.(data, index);
      } catch (error) {
        setStatus('failed');
        isSuccess = false;
      }
      index++;
    });
    if (isSuccess) {
      setStatus('ok');
    }
  };
  useEffect(() => {
    start();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return <Status status={status} />;
};
