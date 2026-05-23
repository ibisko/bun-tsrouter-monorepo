# Session

根据下面的 Session ，判断用户的消息最有可能是属于哪种

<!-- 最近24小时用过的 session，这时间我怕数据量膨胀，太多了吧 -->

```json
<|SESSIONS|>
```

返回格式

```ts
type Response = {
  type: 'match_session';
  session_ids: number[];
};
```

## 没有合适的会话

你仅负责分析用户的意图，理解用户发送的消息的意图是否足够清楚

如果用户的消息没有实际内容，不直观，不明确

```ts
type Response = {
  type: 'incomprehension';
};
```

如果足够清楚

```ts
type Response = {
  type: 'clear';
  query: string; // 可以稍微完善下用户的需求，但不要脱离用户需求的范围，最小边界
  confidence: number; // 0~1 当前意图的置信度
};
```

如果不够清晰那就猜测用户具体的意图会是什么，最多给出5条猜测

```ts
type Response = {
  type: 'try_understand';
  querys: {
    query: string;
    confidence: number; // 0~1 置信度低于 0.85 就不要
  }[];
};
```

注意返回内容是要中文
如果存在专业术语的词汇，就保持原来的
