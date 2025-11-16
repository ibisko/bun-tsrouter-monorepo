import { cn } from '@/main';
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
    <input
      type={type}
      autoComplete={autoComplete === 'off' && type === 'password' ? 'new-password' : autoComplete}
      className={cn('flex h-11 w-full rounded-md px-3 py-2 text-sm bg-white', 'border border-gray-300')}
      placeholder={placeholder}
      {...register(name, { required: required })}
    />
  );
};
