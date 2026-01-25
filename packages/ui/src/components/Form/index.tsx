import { FormInput } from './Input';
import { FormPasswordInput } from './PasswordInput';
import { FromSelect } from './Select';
import { FormTextarea } from './Textarea';

export * from './FormErrorMessage';

export const Form = {
  Select: FromSelect,
  Input: FormInput,
  Textarea: FormTextarea,
  PasswordInput: FormPasswordInput,
};
