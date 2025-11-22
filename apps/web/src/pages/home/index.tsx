import { Button, cn, FormErrorMessage, FormInput, LoadingDiv, PasswordInput } from '@packages/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userActions } from '@/stores/user';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      // todo 可加载本地记录
      // account: 'admin',
      // password: '1DiKmZQG-lAgQMQ23EeCbZbSqiqkbmS_zG6C2Xt96WMmh9tcIReWpMtNkIki3loT',
      // password: 'bbb234432',
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
          'relative flex flex-col justify-center items-center gap-2 sm:p-10 bg-card shadow-lg px-8',
          'h-screen sm:h-auto sm:rounded-2xl sm:bg-card/95 w-full sm:max-w-[440px]',
        )}>
        <div className="text-xl">登录后台管理系统</div>
        <form className={cn('flex flex-col gap-2 w-full')} onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3">账号</div>
          <FormInput name="account" register={register} placeholder="请输入账号" autoComplete="on" />
          {errors?.account?.type === 'required' && <FormErrorMessage>请输入账号，账号不可为空</FormErrorMessage>}

          <div className="mt-3">密码</div>
          <PasswordInput placeholder="请输入密码" autoComplete="on" {...register('password', { required: true })} />
          {errors?.password?.type === 'required' && <FormErrorMessage>请输入密码，密码不可为空</FormErrorMessage>}

          <Button className="mt-4 py-3 rounded-xl" type="submit">
            登录
          </Button>
        </form>
      </div>
    </LoadingDiv>
  );
};

export default HomePage;

type LoginFormData = {
  account: string;
  password: string;
};
