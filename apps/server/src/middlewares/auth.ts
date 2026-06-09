import jwt from 'jsonwebtoken';
import { Middleware, MiddlewareError } from '@packages/tsrouter/server';
import { JwtPayload } from '@/types/jwt';

type FailOptionParam = {
  status?: number;
  data?: Record<string, unknown>;
  reason?: string;
};

const fail = (message: string, options?: FailOptionParam) => {
  const status = options?.status || 400;
  return new MiddlewareError({ message, reason: options?.reason, func: 'authMiddleware', status, data: options?.data });
};

export const authMiddleware: Middleware = (req, ctx) => {
  const authorization = req.headers.get('authorization');
  if (!authorization) throw fail('没有凭证');

  const token = /^Bearer (.+)$/.exec(authorization)?.[1];
  if (!token) throw fail('凭证无效', { data: { authorization } });

  try {
    const detoken = jwt.verify(token, process.env.AUTH_SECRET) as JwtPayload;
    // jwt payload 里携带的参数可在此设置到上下文
    ctx.userId = detoken.userId;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      throw fail('凭证已过期，请重新登录', {
        status: 401,
        data: { jwtError: 'TokenExpiredError', authorization },
      });

    if (error instanceof jwt.JsonWebTokenError)
      throw fail('凭证解析异常', {
        reason: '凭证解析异常（一般用于测试）',
        data: { jwtError: 'jwt.JsonWebTokenError', authorization },
      });

    throw fail('凭证解析异常', {
      reason: '意外情况',
      data: {
        isInstanceofError: error instanceof Error,
        msg: error instanceof Error ? error.message : error,
        authorization,
      },
    });
  }
};
