import { Input } from '../Input';
import type { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  register: UseFormRegister<T>;
  placeholder?: string;
  type?: 'text' | 'password';
  autoComplete?: 'on' | 'off';
  required?: boolean;
};
export const FormInput = <T extends FieldValues>({
  name,
  placeholder,
  type = 'text',
  autoComplete = 'off',
  required = true,
  register,
}: FormInputProps<T>) => {
  return (
    <Input
      type={type}
      autoComplete={autoComplete === 'off' && type === 'password' ? 'new-password' : autoComplete}
      placeholder={placeholder}
      {...register(name, { required: required })}
    />
  );
};
