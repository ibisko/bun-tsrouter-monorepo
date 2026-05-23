先复刻，先不要考虑中途插入了，那是扩展优化的功能
先把流程跑通再说吧

---

# web search

https://open.bigmodel.cn/api/paas/v4/web_search

- search_query 搜索文本
  - 最大文本长度 70
- search_engine
  - search_std: 智谱基础版搜索引擎
  - search_pro: 智谱高阶版搜索引擎
  - search_pro_sogou: 搜狗
  - search_pro_quark: 夸克搜索
- search_intent 是否进行搜索意图识别，默认不执行搜索意图识别。
  - true：执行搜索意图识别，有搜索意图后执行搜索
  - false：跳过搜索意图识别，直接执行搜索

# 线性 session 切换设计

基础分类：

- 杂乱无意义的
- 自定义可明显分类的
- 对事物进行描述的
- 与人相关的，情感、生活、想法

将最近一段时间的 session 分类成不同的 session 会话线索

从 向量数据库的 session 找到相近的，sub-agent 进行理解，可操作：

- 合并 session，对旧的 session 进行补充

- 对于早期无法确定归类到哪些session的，模糊匹配多项

- 具备同一个 pid 的 `user message` 就是不同的会话线，当进行合并的时候，怎么处理合适呢
  - 同一个 session 里面有不同的 `时间线`
    - 根据用户主动的分化
    - 用户时间间隔

## UI

根据 `role="user"` 的消息进行灵活切换

- 对于编辑过的 `user message` 就是新的分化，具有同一个pid

## sub-agent

class instance 提供 insertUserMessage 方法来中途插入用户消息
通常是要指定哪个 agent 来补充的
对于没有指定 agent ，则进行广播到全部

- sub-agent可配置对于中途插入的userMessage，是等到执行完后再执行，还是先中断（是安全的）再重新做呢
  - 对于正在写代码的agent，是等执行完毕后再执行是吗？
    - 虽然不够及时，但足够不会出错
    - agent 自定义逻辑，由agent来权衡是否需要中断
