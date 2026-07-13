import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Select } from '../Select';

type FromSelectProps<T extends Record<string, any>> = {
  name: keyof T;
  control: Control<T, any, T>;
  options: { label: React.ReactNode; value: any }[];
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder?: string;
};
export const FromSelect = <T extends Record<string, any> = {}>({ name, control, options, rules, placeholder }: FromSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <Select
            value={field.value ?? ''}
            placeholder={placeholder}
            options={options}
            onValueChange={val => {
              field.onChange(val);
            }}
          />
          <div>{fieldState.error?.message}</div>
        </>
      )}
    />
  );
};
