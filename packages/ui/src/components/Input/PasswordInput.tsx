import { MaterialSymbolsVisibility, MaterialSymbolsVisibilityOff } from '@/main';
import { InputGroup, InputProps } from './BaseInput';
import { useState } from 'react';

type PasswordInputProps = Omit<InputProps, 'type'>;
export const PasswordInput = ({ autoComplete, ...props }: PasswordInputProps) => {
  const [type, setType] = useState<'password' | 'text'>('password');

  const switchHandle = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  return (
    <InputGroup
      {...props}
      type={type}
      autoComplete={autoComplete === 'off' && type === 'password' ? 'new-password' : autoComplete}
      suffixSlot={
        <div
          className="flex justify-center items-center p-1 rounded cursor-pointer hover:bg-muted-foreground/40 text-muted-foreground"
          onClick={switchHandle}>
          {type === 'password' && <MaterialSymbolsVisibility className="size-4 text-base" />}
          {type === 'text' && <MaterialSymbolsVisibilityOff className="size-4 text-base" />}
        </div>
      }
    />
  );
};
