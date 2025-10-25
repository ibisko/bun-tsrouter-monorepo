import { config } from '@/common/config';
import { hashString } from '@/utils/hash';
import { Context, ServiceError } from '@packages/tsrouter/server';
import z from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '@/database/prisma';
import { UserRole } from '@apps/prisma';
import { merge } from 'lodash-es';
import { JwtPayload } from '@/types/jwt';

export const loginSchema = z.object({
  account: z.string(),
  password: z.string(),
});
export const login = async (param: z.output<typeof loginSchema>, ctx: Context) => {
  ctx.logger.info({ message: '用户登录', data: param });
  const passwordMd5 = hashString(config.authSecret + param.password);
  const count = await prisma.users.count();
  let userInfo;
  if (count === 0) {
    // 对首次登录的账号进行注册
    userInfo = await prisma.users.create({
      data: {
        account: param.account,
        password: passwordMd5,
        role: UserRole.ROOT,
      },
    });
  } else {
    userInfo = await prisma.users.findFirst({
      where: {
        account: param.account,
        deletedAt: null,
      },
    });
    if (!userInfo) {
      throw new ServiceError({
        message: '用户不存在或密码错误',
        reason: '用户不存在',
      });
    }
    if (userInfo.password !== passwordMd5) {
      throw new ServiceError({
        message: '用户不存在或密码错误',
        reason: '密码错误',
      });
    }
  }

  const flag = generateFlag({ password: passwordMd5 });
  // return generateJwt({ flag, userId: userInfo.id });
  const jwtData = generateJwt({ flag, userId: userInfo.id });
  return merge(jwtData, {
    role: userInfo.role,
    id: userInfo.id,
    account: userInfo.account,
  });
};

/** 刷新凭证 */
export const refreshToken = async (ctx: Context) => {
  console.log('refreshToken! ctx:', ctx);

  const authorization = ctx?.headers?.authorization;
  if (!authorization) {
    throw new ServiceError({ message: '缺少凭证', reason: '没有 headers.authorization 的越权访问' });
  }

  const regexpToken = /^Bearer (.+)$/.exec(authorization);
  const token = regexpToken?.[1];
  if (!token) {
    throw new ServiceError({ message: '解析凭证格式错误', data: { authorization } });
  }

  /* console.log({
    token,
    refreshAuthSecret: config.refreshAuthSecret,
  }); */

  let detoken;
  try {
    detoken = jwt.verify(token, config.refreshAuthSecret) as JwtPayload;
    if (!detoken?.userId || detoken.userId <= 0) {
      throw new ServiceError({
        message: '非法用户',
        reason: '非法用户，detoken 解析出 admin_id 异常',
        data: { detoken, authorization },
      });
    }
  } catch (error) {
    throw new ServiceError({
      message: '凭证已失效',
      reason: 'jwt.verify 解析失败，一般是过期了',
      data: { authorization },
    });
  }

  const userInfo = await prisma.users.findFirst({
    where: {
      id: detoken.userId,
      deletedAt: null,
    },
  });
  if (!userInfo) {
    throw new ServiceError({
      message: '账号已被移除',
      data: {
        authorization,
      },
    });
  }

  // 检查flag是否有变动
  const flag = generateFlag({ password: userInfo.password });
  if (detoken.flag !== flag) {
    throw new ServiceError({
      message: '某属性值已变动，需要重新登录',
      reason: '密码变了，重新登录',
      data: { detoken },
    });
  }
  return generateJwt({ flag, userId: userInfo.id });
};

type GenerateJwtFlag = {
  password: string;
};
/** 用于检查指定的属性是否变更 */
const generateFlag = ({ password }: GenerateJwtFlag) => hashString([password].join());

type GenerateJwtParam = {
  flag: string;
  userId: number;
};
/** 生成jwt凭证 */
const generateJwt = ({ flag, userId }: GenerateJwtParam) => {
  // 用来记录某些属性是否有变动
  return {
    token: jwt.sign({ flag, userId }, config.authSecret, {
      // expiresIn: '1h',
      expiresIn: '10s',
    }),
    refreshToken: jwt.sign({ flag, userId }, config.refreshAuthSecret, {
      // expiresIn: '7d',
      expiresIn: '30s',
    }),
  };
};
