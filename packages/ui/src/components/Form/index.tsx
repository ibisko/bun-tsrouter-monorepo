import { FormInput } from './Input';
import { FromSelect } from './Select';
import { FormTextarea } from './Textarea';

export * from './Input';
export * from './FormErrorMessage';

export const Form = {
  Select: FromSelect,
  Input: FormInput,
  Textarea: FormTextarea,
};
