import { cn } from '@packages/ui';
import { useEffect, useState } from 'react';

type SseCardOptions = {
  length: number;
  sseHandle: () => (data: any) => Promise<void>;
};

export const SseCard = ({ length, sseHandle }: SseCardOptions) => {
  const [step, setStep] = useState<Step[]>([]);
  const [status, setStatus] = useState<'success' | 'failed' | ''>('');

  const start = async () => {
    const s: Step[] = [];
    for (let i = 0; i < length; i++) {
      s.push({ index: i, actived: false });
    }
    setStep(s);

    let index = 0;
    const callback = sseHandle();
    await callback((data: any) => {
      console.log('data:', data);
      if (index >= length) return;
      setStep(v => {
        v[index].actived = true;
        index++;
        return [...v];
      });
      // todo check if the response meets the requirements.
      // step.current++;
      // setStatus('failed');
    });
    setStatus('success');
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col gap-4">
        <div
          className={cn('flex gap-1 border p-1 rounded-sm transition', {
            'border-primary': status === 'success',
            'border-destructive': status === 'failed',
          })}>
          {step.map(item => (
            <StepBox actived={item.actived} key={item.index} />
          ))}
        </div>
      </div>
    </div>
  );
};

type StepBoxOptions = {
  actived?: boolean;
};
export const StepBox = ({ actived }: StepBoxOptions) => {
  return <div className={cn('size-4 border bg-card rounded transition', { 'bg-primary': actived })}></div>;
};

type Step = { index: number; actived: boolean };
