import { Controller, type Control, type RegisterOptions } from 'react-hook-form';
import { MonacoEditor } from '.';
import { cn } from '@packages/ui';

type FormMonacoEditorProps<T extends Record<string, any>> = {
  className?: string;
  name: keyof T;
  control: Control<T, any, T>;
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
};
export const FormMonacoEditor = <T extends Record<string, any>>({ className, name, rules, control }: FormMonacoEditorProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <MonacoEditor
            className={cn('', className)}
            value={field.value ?? ''}
            onChange={field.onChange}
            language="json"
            options={{ lineNumbers: 'off', folding: false, scrollBeyondLastLine: false }}
          />
          <div>{fieldState.error?.message}</div>
        </>
      )}
    />
  );
};
