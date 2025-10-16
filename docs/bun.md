bun 虽然快，但还是挺多坑的
适合用于开发模式，但对于实际生产运行，还是得用 node 吧

尝试使用bun，发现还是有很多坑

## 当使用 `bun --filter @app/server` 时候，输出会被折叠

后面单独编写逻辑实现启动

```ts
// bun run dev.ts

const exec = (cwd: string) => Bun.spawn(["bun", "run", "dev"], {
    cwd,
    stdout: "inherit", // 输出到当前终端
})

// 等待所有任务完成（或任意一个失败）
~(async function () {
    await Promise.all([
        exec("./packages/utils"),
        exec("./packages/ui"),
        exec("./packages/tsrouter"),
        exec("./apps/web"),
        exec("./apps/server"),
    ]);
}())
```

## pm2 下不支持 bun 的集群模式

只能在node环境下使用了

## watch 模式下，没法阻止控制台会自动清屏

