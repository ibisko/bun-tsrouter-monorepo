顾及己见的 monorepo 模板

有意思的在 `./packages/tsrouter` 对 `Bun.Server` routers 的封装，参考了 `trpc`、`elysia`。

# 环境

- Bun 运行环境

  ```sh
  # https://bun.com/
  curl -fsSL https://bun.sh/install | bash
  ```

- Node.js v22
  用于 prisma 的 preinstall

- redis
  - 端口密码在 `apps/server/.env` 进行修改

# Quick Start

首次初始化

```sh
# 初次运行，安装依赖，构建
bun run init

# 启动
bun dev
```

# Feature Todo

- [ ] 单元测试、集成测试
  - [ ] 全功能检查，提前知道平台异常，如termux
- [ ] git webhook 部署
- [ ] 集群 linux 复用同个端口
- [ ] 更新策略，如何处理新增和关闭服务
- [ ] UI 多主题色
- [ ] `socket.io`
- [ ] 优雅管理进程更新 pm-bun
- [ ] agent 基于现成的工具进行组合，不要新的东西

# redis 应用场景

- [ ] 分布式事务锁
- [x] `zadd` 滑动窗口限流
      `apps/server/src/middlewares/limitRate.ts`

# 设想工具web，项目可视化

- 方便添加svg
- 文件树，有被描述的文件标记，可查阅
- 可视化自动构建
