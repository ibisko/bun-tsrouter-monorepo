import { Input } from '../Input/BaseInput';
import { Control, Controller, RegisterOptions, type FieldErrors } from 'react-hook-form';

type FormInputProps<T extends Record<string, any>> = {
  defaultValue?: any;
  field: keyof T;
  control: Control<T, any, T>;
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder?: string;
  type?: 'text' | 'password';
  autoComplete?: 'on' | 'off';
};
export const FormInput = <T extends Record<string, any>>({
  defaultValue,
  field,
  control,
  placeholder,
  type = 'text',
  autoComplete = 'off',
  rules,
}: FormInputProps<T>) => {
  return (
    <>
      <Controller
        name={field as any}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Input
              type={type}
              autoComplete={autoComplete === 'off' && type === 'password' ? 'new-password' : autoComplete}
              placeholder={placeholder}
              defaultValue={defaultValue}
              {...field}
            />
            <div>{fieldState.error?.message}</div>
          </>
        )}
      />
    </>
  );
};
