# dangerouslySetInnerHTML 导致不必要的 DOM 重写

## 问题

多个渲染 markdown 的组件（如 `<Marked>`），在父组件 setState 触发重新渲染时，即使 `__html` 的值没有变化，React 也会**重新设置 DOM 的 innerHTML**，导致：

- 浏览器重新解析 HTML
- 用户文本选区丢失
- 不必要的性能开销

## 根因

React 对 `dangerouslySetInnerHTML` 的 reconciliation 策略是：不做值比较，直接重写。即使虚拟 DOM 判定 props 没变，`innerHTML` 也会被重新赋值。

`React.memo` 和 `useMemo` 都无法解决这个问题：
- `useMemo` 可以避免重复计算 HTML 字符串
- 但组件函数一旦执行，`dangerouslySetInnerHTML` 就会重写 DOM

## 解决方案

用 `ref` + `useEffect` 替代 `dangerouslySetInnerHTML`，手动控制 DOM 更新：

```tsx
export const Marked = ({ className, content }: MarkedProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => markedInstance.parse(content) as string, [content]);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html;
    }
  }, [html]);

  return <div ref={ref} className={cn('marked-components', className)}></div>;
};
```

关键点：
- `useMemo` 缓存解析结果，`content` 不变时 `html` 引用不变
- `useEffect` 依赖 `html`，只在 HTML 真正变化时才写 DOM
- 历史消息的 DOM 完全不会被触碰，选区不会丢失

## 适用场景

- 聊天消息列表中渲染 markdown
- 任何多个实例同时存在且可能因父组件更新而重新渲染的场景
- 用户可能在渲染区域内进行文本选择/复制操作

## 经验法则

**当组件存在多个实例，且渲染结果涉及 `dangerouslySetInnerHTML` 时，优先使用 `ref` + `useEffect` 手动写 DOM，而不是 `dangerouslySetInnerHTML`。**
