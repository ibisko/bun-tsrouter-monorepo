import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Input } from '../Input/BaseInput';

type FormInputProps<T extends Record<string, any>> = {
  defaultValue?: any;
  name: keyof T;
  control: Control<T, any, T>;
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder?: string;
  type?: 'text' | 'password';
  autoComplete?: 'on' | 'off';
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
export const FormInput = <T extends Record<string, any>>({
  name,
  control,
  placeholder,
  type = 'text',
  autoComplete = 'off',
  rules,
  onKeyDown,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <Input
            type={type}
            autoComplete={autoComplete === 'off' && type === 'password' ? 'new-password' : autoComplete}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            {...field}
            value={field.value ?? ''}
          />
          <div>{fieldState.error?.message}</div>
        </>
      )}
    />
  );
};
