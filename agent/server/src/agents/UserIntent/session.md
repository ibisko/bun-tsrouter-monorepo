这是目前已有的 session ，复盘对话里的所有 `role=user` 的消息，判断每条用户发的消息，最有可能对应哪几种

<!-- 为了避免传入所有的 session ，只会拿最近48小时用过的-->

```json
<|SESSIONS|>
```

## 如果匹配到合适的 session

```ts
type Response = {
  type: 'match_session';
  data: {
    user_role_index: number; // 过滤只有 `role=user` 的消息列表的序号
    session_ids: number[];
  }[];
};
```

<!-- todo 在大 session 之下可以进一步细分的会话 -->

## 如果不存在就创建 session

```ts
type Response = {
  type: 'create_session';
  data: {
    title: string; // 简单的理解小标题，只是给用户看的
    description: string; // 描述总结 session 的内容，用与匹配
    user_role_indexs: number[];
  }[];
};
```

为了更好匹配上，description 可以在前面带上些关键词

<!-- todo 总结策略，拿过去24小时的对话，1/3时间也就是16~24小时是归档的，其他时间都还是在预测 -->
<!-- todo 总结时候，可以适当删掉不同会话的开头pid，可以修改拼接pid使会话更连贯 -->
<!-- todo 总结时候，对合适匹配的会话处理？ -->

<!-- todo 拿 embedding 置信度最高的那个，pid 父级逐层拼接 description -->
