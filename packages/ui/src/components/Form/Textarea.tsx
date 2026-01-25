import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Textarea } from '../Input';

type FormInputProps<T extends Record<string, any>> = {
  defaultValue?: any;
  name: keyof T;
  control: Control<T, any, T>;
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder?: string;
};
export const FormTextarea = <T extends Record<string, any>>({ defaultValue, name, control, placeholder, rules }: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <Textarea placeholder={placeholder} defaultValue={defaultValue} {...field} />
          <div>{fieldState.error?.message}</div>
        </>
      )}
    />
  );
};
