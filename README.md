基础模版，仅实现基本功能

专注于单体应用，内网服务

# 使用方式

1. 在主项目切一个分支如 base-template 仅做保存模版代码
2. 之后的分支都可以从 base-template 切出来
3. base-template 不做修改，只用来同步


# Feature

- [x] shacn

- [x] @apps/web
- [x] @apps/server
- [x] @packages/utils
- [x] @packages/ui
- [x] tailwindcss
- [x] react-router-dom

- [ ] prisma sqlite
- [ ] 构建脚本
- [ ] git webhook 部署更新
- [x] 状态管理 valtio
- [ ] ~~多个 oss 对接~~
    - ~~oss 数据备份~~
- [ ] server 采用 esmodule 对于 *.js 如何更好处理

# 后端

- [ ] 鉴权
    - [ ] 登录
    - [ ] jwt刷新
    - [ ] service 入参 uid 字段
        - 设想参考函数参数装饰器，从第二参数传入，前端隐藏第二参数
- [ ] vitest 测试框架


## 请求

- [x] 类似 trpc 封装
    - [ ] 流式上传
    - [ ] 流式响应 (chat 流式返回例子)
    - [ ] 流式下载
- [ ] socket.io
- [ ] SSE 服务端事件


# 运维

- [ ] nginx 配置及前端
- [ ] 证书续期


```ts
import { main } from "bun";
// 可用于 cli 开发，安装到全局
```
