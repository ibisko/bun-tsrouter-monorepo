import { MaybePromise } from '@packages/utils/types';
import { useState } from 'react';
import { Switch } from '.';
import { cn } from '@/utils/cn';

type AsyncSwitchProps = {
  className?: string;
  value: boolean;
  onCheck: (checked: boolean) => MaybePromise<void>;
  onError?: (error: unknown) => void;
};

export const AsyncSwitch = ({ className, value, onCheck, onError }: AsyncSwitchProps) => {
  const [pending, setPending] = useState(false);
  const onCheckedChange = async (val: boolean) => {
    try {
      setPending(true);
      await onCheck(val);
    } catch (error) {
      onError?.(error);
    } finally {
      setPending(false);
    }
  };

  return <Switch className={cn(className)} checked={value} onCheckedChange={onCheckedChange} disabled={pending} />;
};
