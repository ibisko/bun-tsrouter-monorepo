- [x] 前端可视化单元测试
- [x] ctx 集成日志

- client 中断 sse 时候，server sse仍在执行
- 刷新 token
- 403 等错误码的钩子回调
- 400 异常抛出的自定义 Error
- xhr formData 流式上传，上传进度
- fetch 流式下载文件，下载进度
- socket.io
  - 是否合适封装到 TsRouter
  - 如何设计封装
  - 聊天室调研
- 如何进行模块化测试？

---

# Web Fetch Options

````ts
fetch(url, {
  method,
  headers: headers,
  /**
   * ```ts
   * const controller = new AbortController();
   * fetch('/api', { signal: controller.signal });
   * controller.abort(); // 取消请求
   * ```
   */
  signal: signal,

  /**
   *  GET、HEAD、SSE 请求不能包含 body
   */
  body: ['get', 'sse', 'head'].includes(method) ? undefined : JSON.stringify(body),

  /**
   * 携带 cookies 凭证
   * - omit (默认)绝不发送或接收任何凭证
   * - same-origin 仅在请求同源 URL 时发送凭证
   * - include 总是发送凭证，即使跨域
   */
  // credentials: 'omit'

  /**
   * 控制请求与浏览器缓存的交互方式。
   * - default
   * - force-cache
   * - no-cache
   * - no-store
   * - only-if-cached
   * - reload
   */
  // cache:

  /**
   * 指定是否允许跨域请求。
   * - cors (默认)允许跨域请求。
   * - same-origin 只允许同源请求。
   * - no-cors 允许跨域，但只能使用简单的请求方法和头。
   */
  // mode:

  /**
   * 指定如何处理重定向响应。
   * - follow (默认)自动跟随重定向。
   * - error 如果遇到重定向，则抛出错误。
   * - manual 手动处理重定向。
   */
  // redirect:

  /** 指示请求在页面卸载后是否继续执行（用于发送埋点数据等） */
  // keepalive:

  /**
   * integrity主要用于 CDN 资源校验​​。
   */
  // integrity:
});
````
