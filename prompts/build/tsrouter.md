# 目标

写一个使用 tsrouter 包的 prompt，用于给 agent 来参考使用，输出到 `prompts/skills/tsrouter.md`

# 关键的文件范围

- server
  - `apps/server/src/services/tsRouterTest` 这里是在 service 的使用
  - `apps/server/src/router/tsrouter.ts` 这里是注册到 router ，并且还有中间件
- web
  - `apps/web/src/pages/tsRouter` 这里是前端使用的方式
  - `apps/web/src/api/index.ts` 这里是前端Api的注册，类型绑定
- package
  - `packages/tsrouter` 这里是 tsrouter 的具体实现
