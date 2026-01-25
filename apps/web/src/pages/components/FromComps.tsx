import { Button, Card, Form } from '@packages/ui';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const FromComps = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      account: '',
      password: '',
    },
  });

  const submit = async (data: FormData) => {
    console.log('submit', data);
    toast.info(JSON.stringify(data));
  };

  return (
    <Card>
      <div className="font-bold">Form Data</div>

      <div>{'<Form.Input/>'}</div>
      <Form.Input<FormData> name="account" control={control} placeholder="pls input your email" rules={{ required: 'pls input account!' }} />

      <div>{'<Form.PasswordInput/>'}</div>
      <Form.PasswordInput<FormData>
        name="password"
        control={control}
        autoComplete="off"
        placeholder="pls input your password"
        rules={{ required: 'pls input password!' }}
      />

      <div>{'<Form.Select/>'}</div>
      <Form.Select<FormData>
        name="selectType"
        control={control}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
          { label: 'D', value: 'd' },
        ]}
        placeholder="pls selet type"
        rules={{ required: 'pls selet type' }}
      />

      <div>{'<Form.Textarea/>'}</div>
      <Form.Textarea<FormData> name="remark" control={control} placeholder="pls input remark" rules={{ required: 'pls input remark' }} />

      <div>
        <Button onClick={handleSubmit(submit)}>Submit</Button>
      </div>
    </Card>
  );
};

type FormData = {
  account: string;
  password: string;
  selectType: string;
  remark: string;
};
