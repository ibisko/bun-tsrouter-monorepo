顾及己见的 monorepo 模板

有意思的在 `./packages/tsrouter` 对 `Bun.Server` routers 的封装，参考了 `trpc`、`elysia`。

# 环境

- Bun 运行环境

  ```sh
  # https://bun.com/
  curl -fsSL https://bun.sh/install | bash
  ```

- PNPM 运行环境
  用于 monorepo 管理
  减少磁盘空间占用

- Node.js v22
  用于 prisma 的 preinstall
  用于 vite 运行

- watchman
  https://facebook.github.io/watchman/docs/install

  ```sh
  # macos
  brew install watchman
  ```

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
- [ ] UI 多主题色
- [ ] `socket.io`
- [ ] agent 基于现成的工具进行组合，不要新的东西
  <!-- - [ ] 集群 linux 复用同个端口 -->
  <!-- - [ ] 更新策略，如何处理新增和关闭服务 -->
  <!-- - [ ] 优雅管理进程更新 pm-bun -->

# redis 应用场景

- [ ] 分布式事务锁，任务队列
<!-- - [x] `zadd` 滑动窗口限流
      `apps/server/src/middlewares/limitRate.ts` -->

# 设想工具web，项目可视化

- 方便添加svg
- 可视化自动构建
<!-- - 文件树，有被描述的文件标记，可查阅 -->

# fontmin

缩小字体文件，提取字体的子集

## 前置安装

macos

```sh
# 字体库工具
brew install harfbuzz

# 字体转woff2
brew install woff2
```

```sh
bun run ./scripts/fontmin.ts
# 具体操作可修改
```

## 注意

- vite还是在nodejs上跑的
- bun的monorepo引入packages可以源码.ts文件引入

```sh
# 有时候遇到 watchman 的警告，这样就好了
watchman watch-del '/Users/xxxx/bun-tsrouter-monorepo'

# 移除当前目录的 watchman 项目根记录
watchman watch-del .

# 接着直接重启即可，因为脚本里已经有 watch-project 了
# 因为用了 watch-project 命令，向上找到 .watchmanconfig 为止来作为根目录，就别删这个文件了
```
