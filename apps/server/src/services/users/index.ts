import { Context, ServiceError } from '@packages/tsrouter/server';
import prisma from '@/database/prisma';

export const getUserInfo = async (ctx: Context) => {
  const authorization = ctx.headers.authorization;
  console.log('authorization:', authorization);

  const userInfo = await prisma.users.findFirst({
    where: {
      id: ctx.userId,
    },
  });

  if (!userInfo) {
    throw new ServiceError({ message: '找不到用户' });
  }

  return {
    id: userInfo.id,
    account: userInfo.account,
    role: userInfo.role,
  };
};
