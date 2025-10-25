import { Context, ServiceError } from '@packages/tsrouter/server';
import prisma from '@/database/prisma';
import jwt from 'jsonwebtoken';

export const getUserInfo = async (ctx: Context) => {
  const authorization = ctx.headers.authorization;
  console.log('authorization:', authorization);
  // console.log('ctx:', ctx);

  // jwt.verify(token, config.refreshAuthSecret) as { admin_id: number; role: unknown; flag: string };

  const userInfo = await prisma.users.findFirst({
    // where: {},
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
