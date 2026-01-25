import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Input } from '../Input/BaseInput';
import { PasswordInput } from '../Input';

type FormPasswordInputProps<T extends Record<string, any>> = {
  defaultValue?: any;
  name: keyof T;
  control: Control<T, any, T>;
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder?: string;
  type?: 'text' | 'password';
  autoComplete?: 'on' | 'off';
};
export const FormPasswordInput = <T extends Record<string, any>>({
  name,
  control,
  placeholder,
  type = 'text',
  autoComplete = 'off',
  rules,
}: FormPasswordInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <PasswordInput
            autoComplete={autoComplete === 'off' && type === 'password' ? 'new-password' : autoComplete}
            placeholder={placeholder}
            {...field}
          />
          <div>{fieldState.error?.message}</div>
        </>
      )}
    />
  );
};
