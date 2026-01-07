顾及己见的 monorepo 模板
有意思的在 `./packages/tsrouter` 对 `Bun.Server` routers 的封装，参考了 `trpc`、`elysia`。

# 环境

- Bun 运行环境

  ```sh
  # https://bun.com/
  curl -fsSL https://bun.sh/install | bash
  ```

- redis
  - 端口密码在 `apps/server/.env` 进行修改

# 初始化

```sh
# prisma
cd ./app/server
bun generate
bun execture
bun diff
bun execture
```

# 启动

```sh
# 在项目根目录运行
bun dev
# 首次执行可能失败，重新运行即可
```

# Feature

- [ ] 单元测试、集成测试
- [ ] git webhook 部署
- [ ] 集群 linux 复用同个端口
- [ ] 更新策略，如何处理和新增服务
- [ ] UI 多元主题色
- [ ] `vitest` 测试框架
- [ ] `socket.io`
