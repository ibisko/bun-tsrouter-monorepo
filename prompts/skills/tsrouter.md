# tsrouter

全栈类型安全路由包，提供 REST API、SSE、文件上传能力。基于 Bun + Zod。

- Server: `@packages/tsrouter/server`
- Client: `@packages/tsrouter/client`

---

## Server

### 导入

```ts
import { procedure, createRouter, Logger, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import type { Context, Middleware, SseService, WriteFunc } from '@packages/tsrouter/server';
import { MiddlewareError, ValidationError, ServiceError } from '@packages/tsrouter/server';
```

### procedure 定义路由

```ts
// REST API — 无参数
const get1 = procedure.get(() => {
  return { msg: 'ok' };
});

// REST API — 有参数 (Zod schema)
import z from 'zod';

const get2Schema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

const get2 = procedure.get(get2Schema, async (param: z.output<typeof get2Schema>, { logger }: Context) => {
  logger.info({ msg: 'received', data: param });
  return param;
});

// 同理: procedure.post / .patch / .put / .delete，签名一致

// SSE — 无参数
const sse1 = procedure.sse(async ({ write, signal }) => {
  for (let i = 0; i < 5; i++) {
    await write(`msg ${i}`);
    await sleep(1000);
    signal.throwIfAborted();
  }
});

// SSE — 有参数
const sse2 = procedure.sse(sse2Schema, async (param, { write, signal, ctx }) => {
  await write(`hello ${param.name}`);
});

// 文件上传
const upload1 = procedure.uploadFile(async (formData: FormData) => {
  const file = formData.get('file') as File;
  if (!file) throw new ServiceError({ message: '缺少file' });
  // 处理文件...
});
```

### Context 对象

service 函数的第二个参数（或解构参数），包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `url` | `string` | 请求 URL |
| `ip` | `Bun.SocketAddress \| null` | 客户端 IP |
| `headers` | `Headers` | 请求头 |
| `resHeaders` | `Headers` | 响应头（可修改） |
| `params` | `Record<string, string>` | 路由参数 |
| `body` | `Bun.BunRequest['body']` | 请求体 |
| `logger` | `Logger` | 结构化日志 |

### SSE WriteFunc

```ts
write(data: string): Promise<void>;           // 默认 event: message
write(data: string, event: string): Promise<void>;  // 自定义 event
```

### 错误处理

```ts
// Service 错误（默认 400）
throw new ServiceError({ message: '错误信息' });
throw new ServiceError({ message: '错误', status: 403, reason: '原因', data: { key: 'val' } });

// Middleware 错误（需要 func 字段）
throw new MiddlewareError({ func: 'auth', message: '未登录', status: 401 });
```

### Logger

```ts
const logger = new Logger();

// 日志级别
logger.info({ msg: '信息' });
logger.error({ msg: '错误', reason: '原因', data: { ... } });
logger.warn({ msg: '警告' });
logger.debug({ msg: '调试' });

// 创建子 logger
const childLogger = logger.child({ func: 'serviceName' });
```

### Middleware

```ts
const authMiddleware: Middleware = (request, ctx) => {
  const token = request.headers.get('authorization');
  if (!token) {
    throw new MiddlewareError({ func: 'auth', message: 'Missing token', status: 401 });
  }
  // 继续处理...
};
```

### createRouter

```ts
const mainRouter = createRouter({
  prefix: ['api'],        // URL 前缀，生成 /api/xxx
  logger,
  middlewares: [authMiddleware, corsMiddleware],
  router: {
    user: {
      info: procedure.get(getUserInfo),
      $id: {
        detail: procedure.get(getUserDetailSchema, getUserDetail),  // $ 前缀 → 动态路由 /user/:id/detail
      },
    },
    auth: {
      login: procedure.post(loginSchema, login),
      refreshToken: procedure.get(refreshToken),
    },
  },
});
```

> **路径规则**: 对象 key 转 kebab-case，`$` 前缀的 key 转为动态参数 `:param`。
> 例: `{ user: { $id: { 'get-detail': procedure.get(...) } } }` → `/user/:id/get-detail`

### 导出 AppRouter 类型

```ts
export type AppRouter = ReplaceSpecificLeaf<typeof mainRouter>;
// 在 client 端使用 createAppRouter<AppRouter>(tsRouter) 获得完整类型推导
```

---

## Client

### 导入

```ts
import { TsRouter, createAppRouter, ResponseError } from '@packages/tsrouter/client';
import { RefreshFailed } from '@packages/tsrouter/client';
```

### 创建实例

```ts
const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prefix: '/api',
  setHeaders: headers => {
    headers.set('authorization', `Bearer ${token}`);
  },
  async refreshToken(abort) {
    // 收到 401 时自动调用
    const res = await fetch('/api/auth/refresh-token', { ... });
    if (!res.ok) {
      if (res.status === 400) throw new RefreshFailed();  // 停止重试
      if (res.status === 403) { abort(); return; }         // 中断当前请求
    }
    const data = await res.json();
    // 更新 token...
  },
  onResponseError(error) {
    if (error instanceof RefreshFailed) {
      // 刷新失败，跳转登录
    }
  },
});

// 创建类型安全 API
export const Api = createAppRouter<AppRouter>(ins);
```

### 调用 API

```ts
// REST — 自动匹配服务端路由路径
const data = await Api.user.info.get();
const result = await Api.auth.login.post({ username: 'x', password: 'y' });

// SSE
Api.messages.sse({ userId: 1 })((data) => {
  console.log('received:', data);
});

// 文件上传
const formData = new FormData();
formData.append('file', file);
const result = await Api.upload.file.uploadFile(formData, {
  onPercent: (percent) => console.log(`${percent}%`),
});
```

### 错误处理

```ts
try {
  await Api.user.info.get();
} catch (error) {
  if (error instanceof ResponseError) {
    console.log(error.message, error.status, error.isNetworkError);
  }
}
```
