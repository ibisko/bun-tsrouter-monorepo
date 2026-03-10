import { Button, cn, Form, LoadingDiv } from '@packages/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userActions } from '@/stores/user';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      account: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (param: LoginFormData) => {
    setLoading(true);
    try {
      await userActions.login(param.account, param.password);
      console.log('跳转');
      navigate({ to: '/app/components', replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <LoadingDiv loading={loading} className="h-screen flex justify-center items-center">
      <div
        className={cn(
          'relative flex flex-col justify-center items-center gap-2 shadow-lg',
          'max-sm:px-8 sm:p-10',
          'max-sm:bg-card sm:bg-card/95',
          'max-sm:w-full sm:w-[440px]',
          'max-sm:h-full sm:h-auto',
          'sm:rounded-2xl',
        )}>
        <div className="text-xl">登录后台管理系统</div>
        <div className={cn('flex flex-col gap-2 w-full')}>
          <div className="mt-3">账号</div>
          <Form.Input name="account" control={control} placeholder="请输入账号" autoComplete="on" rules={{ required: '请输入账号，账号不可为空' }} />

          <div className="mt-3">密码</div>
          <Form.PasswordInput
            name="password"
            placeholder="请输入密码"
            autoComplete="on"
            control={control}
            rules={{ required: '请输入密码，密码不可为空' }}
          />

          <Button className="mt-4 py-3 rounded-xl" onClick={handleSubmit(onSubmit)}>
            登录
          </Button>
        </div>
      </div>
    </LoadingDiv>
  );
};

export default HomePage;

type LoginFormData = {
  account: string;
  password: string;
};
