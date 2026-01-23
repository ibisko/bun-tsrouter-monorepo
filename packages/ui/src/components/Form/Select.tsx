import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Select } from '../Select';

type FromSelectProps<T extends Record<string, any>> = {
  defaultValue?: any;
  field: keyof T;
  control: Control<T, any, T>;
  options: { label: React.ReactNode; value: any }[];
  rules?: Omit<RegisterOptions<T, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder?: string;
};
export const FromSelect = <T extends Record<string, any> = {}>({ defaultValue, field, control, options, rules, placeholder }: FromSelectProps<T>) => {
  return (
    <>
      <Controller
        name={field as any}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Select
              placeholder={placeholder}
              defaultValue={defaultValue}
              options={options}
              onValueChange={val => {
                field.onChange(val);
              }}
            />
            <div>{fieldState.error?.message}</div>
          </>
        )}
      />
    </>
  );
};
