import jwt from 'jsonwebtoken';
import { Middleware, MiddlewareError } from '@packages/tsrouter/server';
import { JwtPayload } from '@/types/jwt';

export const authHook: Middleware = (req, ctx) => {
  const authorization = req.headers.get('authorization');
  if (!authorization) {
    throw new MiddlewareError({
      message: '没有凭证',
      func: 'authJwtDecode',
      status: 400,
    });
  }

  const regexpToken = /^Bearer (.+)$/.exec(authorization);
  const token = regexpToken?.[1];
  if (!token) {
    throw new MiddlewareError({
      message: '凭证无效',
      func: 'authJwtDecode',
      status: 400,
      data: {
        authorization,
      },
    });
  }

  let jwtDecode;
  try {
    jwtDecode = jwt.decode(authorization);
  } catch (error) {
    throw new MiddlewareError({
      message: '凭证解析失败',
      func: 'authJwtDecode',
      status: 400,
      data: {
        authorization,
      },
    });
  }

  try {
    const detoken = jwt.verify(token, process.env.authSecret) as JwtPayload;
    ctx.userId = detoken.userId;

    // todo 参数设置上下文
    // jwtDecode.admin
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new MiddlewareError({
        message: '凭证已过期，请重新登录',
        func: 'authJwtDecode',
        status: 401,
        data: {
          jwtError: 'jwt.TokenExpiredError',
          authorization,
          jwtDecode,
        },
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new MiddlewareError({
        message: '凭证解析异常',
        reason: '凭证解析异常（一般用于测试）',
        func: 'authJwtDecode',
        status: 400,
        data: {
          jwtError: 'jwt.JsonWebTokenError',
          authorization,
          jwtDecode,
        },
      });
    }

    const msg = error instanceof Error ? error.message : error;
    throw new MiddlewareError({
      message: '凭证解析异常',
      reason: '意外情况',
      func: 'authJwtDecode',
      status: 400,
      data: {
        isInstanceofError: error instanceof Error,
        msg,
        authorization,
        jwtDecode,
      },
    });
  }
};
