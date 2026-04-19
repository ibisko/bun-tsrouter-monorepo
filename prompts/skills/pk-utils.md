# @packages/utils

工具函数库，分三个入口：

| 入口 | 导入 | 环境 |
|------|------|------|
| 通用 | `import { ... } from '@packages/utils'` | server + web |
| Server | `import { ... } from '@packages/utils/server'` | 仅 server |
| Web | `import { ... } from '@packages/utils/web'` | 仅 web |
| Types | `import type { ... } from '@packages/utils/types'` | 类型 |

---

## 通用 (`@packages/utils`)

### retryHandle

异步重试，失败自动重试。默认 3 次，间隔 1s。

```ts
import { retryHandle } from '@packages/utils';

// 基本用法
await retryHandle(() => fetchSomething());

// 注意：用箭头函数包裹，避免 this 丢失
await retryHandle(() => this.getCredential());

// 自定义选项
await retryHandle(async (abort) => {
  const data = await fetchData();
  if (!data) abort(); // 主动中止，不再重试
  return data;
}, { maxTryCount: 5, delay: 2000 });
```

### sleep

```ts
import { sleep } from '@packages/utils';
await sleep(1000); // 1s
```

### WatchDog

看门狗定时器，每次 `feed()` 重置计时，超时触发回调。

```ts
import { WatchDog } from '@packages/utils';

const watchdog = new WatchDog(() => {
  console.log('超时了！');
}, 5000);

watchdog.feed(); // 重置 5s 计时
watchdog.kill(); // 停止
```

### createRecursiveProxy

递归代理，访问任意深度的属性路径时触发 handler。tsrouter 的 `createAppRouter` 基于此实现。

```ts
import { createRecursiveProxy } from '@packages/utils';

// 函数 handler — 路径数组作为第一个参数
const proxy = createRecursiveProxy((path, ...args) => {
  console.log(path.join('.'), args); // e.g. ['user', 'profile']
});

proxy.user.profile({ id: 1 }); // ['user', 'profile'], [{ id: 1 }]

// 对象 handler — 按最后一个 key 分发
const proxy2 = createRecursiveProxy({
  get: (path, ...args) => fetch('GET', path, ...args),
  post: (path, ...args) => fetch('POST', path, ...args),
});

proxy2.user.profile.get();   // → get handler
proxy2.user.profile.post();  // → post handler
```

### nanoid

生成随机 ID，默认 12 位。

```ts
import { nanoid } from '@packages/utils';
const id = nanoid();    // 12位
const id2 = nanoid(8);  // 8位
```

### 装饰器

```ts
import { Throttle, WaitQueue } from '@packages/utils';

class Service {
  @Throttle(1000)
  handleClick() { /* 节流 1s */ }

  @WaitQueue
  async process() { /* 确保同一实例串行执行，后续调用排队等待 */ }
}
```

---

## Server (`@packages/utils/server`)

### fsEnsureMkdir

确保目录存在，不存在则递归创建。

```ts
import { fsEnsureMkdir } from '@packages/utils/server';
await fsEnsureMkdir(process.cwd(), '__tmp', 'uploads');
```

### hashFile

文件哈希，支持多种输入和算法，默认 sha1。

```ts
import { hashFile } from '@packages/utils/server';

// 文件路径
const h1 = await hashFile('/path/to/file');
// File 对象
const h2 = await hashFile(file);
// Buffer
const h3 = await hashFile(buffer, 'sha256');
// 指定算法
const h4 = await hashFile('/path/to/file', 'md5');
```

### spawnText

执行命令并返回 stdout，非零退出码抛错。

```ts
import { spawnText } from '@packages/utils/server';
const output = await spawnText('git', 'rev-parse', 'HEAD');
```

---

## Web (`@packages/utils/web`)

### hashFile

浏览器端文件 MD5 哈希。

```ts
import { hashFile } from '@packages/utils/web';
const hash = await hashFile(fileInput.files[0]);
```

### hashString

浏览器端字符串哈希，默认 sha-1。

```ts
import { hashString } from '@packages/utils/web';
const hash = await hashString('hello');
const hash2 = await hashString('hello', 'sha-256');
```

---

## Types (`@packages/utils/types`)

```ts
import type { Nullable, DeepPartial, Undefinedable, Func, AwaitedReturn, IsPlainObject } from '@packages/utils/types';

type A = Nullable<{ name: string; age: number }>;
// { name: string | null; age: number | null }

type B = DeepPartial<{ user: { name: string } }>;
// { user?: DeepPartial<{ name: string }> }

type C = Undefinedable<{ name: string }>;
// { name?: string }

type D = Func;                           // (...args: any) => any
type E = AwaitedReturn<() => Promise<string>>;  // string
type F = IsPlainObject<string[]>;        // false
type G = IsPlainObject<{ a: 1 }>;        // true
```
