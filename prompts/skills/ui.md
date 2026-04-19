# @packages/ui

React 组件库，基于 Tailwind CSS + Radix UI + React Hook Form。

```ts
import { Button, Card, Dialog, ... } from '@packages/ui';
```

---

## 组件一览

### Button

```tsx
<Button>默认</Button>
<Button variant="destructive">删除</Button>
<Button variant="outline">描边</Button>
<Button variant="secondary">次要</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>

<Button size="sm">小</Button>
<Button size="default">中</Button>
<Button size="lg">大</Button>
<Button size="icon">图标</Button>
<Button size="icon-sm">图标小</Button>
<Button size="icon-lg">图标大</Button>

<Button link href="/about">作为链接</Button>
```

### Input / InputGroup / PasswordInput / Textarea

```tsx
import { Input, InputGroup, PasswordInput, Textarea } from '@packages/ui';

<Input placeholder="输入" />
<Input type="number" />

<InputGroup prefixSlot="$" suffixSlot=".00">
  {/* 内部 input 自动填满 */}
</InputGroup>

<PasswordInput placeholder="密码" />

<Textarea placeholder="内容" rows={4} />
```

### Select (Radix)

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectSeparator } from '@packages/ui';

// 简写: options 模式
<Select
  placeholder="选择"
  options={[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { groupName: '分组', children: [{ label: '子项', value: '3' }] },
  ]}
/>

// 组合模式
<Select>
  <SelectTrigger>选择</SelectTrigger>
  <SelectContent>
    <SelectItem value="1">选项1</SelectItem>
    <SelectSeparator />
    <SelectItem value="2">选项2</SelectItem>
  </SelectContent>
</Select>
```

### Form (react-hook-form)

```tsx
import { Form } from '@packages/ui';
import { useForm } from 'react-hook-form';

type FormData = { email: string; password: string; category: string; message: string };
const { control } = useForm<FormData>();

<Form.Input control={control} name="email" placeholder="邮箱" rules={{ required: true }} />
<Form.PasswordInput control={control} name="password" />
<Form.Textarea control={control} name="message" placeholder="留言" />
<Form.Select
  control={control}
  name="category"
  options={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]}
/>
<Form.ErrorMessage>必填项</Form.ErrorMessage>
```

### Table

```tsx
import { Table, type Columns } from '@packages/ui';

type User = { id: number; name: string; role: string };
const columns: Columns<User>[] = [
  { tilte: '姓名', dataIndex: 'name', width: 120 },
  { tilte: '角色', dataIndex: 'role' },
  { tilte: '操作', render: (row) => <button>编辑</button> },
];

<Table<User> data={users} columns={columns} primaryKey="id" onRowClick={(row) => console.log(row)} />
```

> `Columns<T>.tilte` 是字段名（原始拼写，非 title）。支持 `fixed: 'left' | 'right'` 和 `stickyOffset`。

### Card

```tsx
import { Card } from '@packages/ui';

<Card className="p-6">
  <h2>标题</h2>
  <p>内容</p>
</Card>
```

### Dialog

```tsx
import { Dialog } from '@packages/ui';

const [open, setOpen] = useState(false);
<Dialog open={open} cancel={() => setOpen(false)}>
  <div className="p-6">弹窗内容</div>
</Dialog>
```

> 自动 Portal 到 body，带进入/退出动画。

### Tooltip

```tsx
import { Tooltip } from '@packages/ui';

<Tooltip title="提示文字" orientation="top">
  <button>悬停</button>
</Tooltip>
```

> `orientation`: `'top' | 'bottom' | 'left' | 'right'`，默认 `top`。

### Popover

```tsx
import { Popover } from '@packages/ui';

<Popover trigger={<button>打开</button>} side="bottom" align="start" sideOffset={4}>
  <div className="p-4">弹出内容</div>
</Popover>
```

> 支持受控 `open` / 非受控 `defaultOpen`。`side`: `'top' | 'bottom' | 'left' | 'right'`。点击外部自动关闭。

### LoadingDiv

```tsx
import { LoadingDiv } from '@packages/ui';

<LoadingDiv loading={isLoading}>
  <Content />
</LoadingDiv>
```

> `maskColor` 自定义遮罩颜色，`maskClassName` 自定义遮罩样式。

### ContentEditable

```tsx
import { ContentEditable } from '@packages/ui';

<ContentEditable value={text} onChange={setText} placeholder="输入..." onSend={handleSend} />
```

> Enter 发送（`onSend`），Shift+Enter 换行。

### Descriptions

```tsx
import { Descriptions } from '@packages/ui';

<Descriptions
  data={[
    { id: 1, title: '名称', value: 'John' },
    { id: 2, title: '邮箱', value: 'john@example.com' },
    { id: 3, title: '状态', value: <span className="text-green-500">在线</span> },
  ]}
  thWidth={100}
  hideLine={false}
/>
```

### PreCode

```tsx
import { PreCode } from '@packages/ui';

<PreCode content="console.log('hello')" type="javascript" />
```

### cn 工具函数

```ts
import { cn } from '@packages/ui';
// clsx + tailwind-merge
cn('base-class', condition && 'active', 'p-4')
```
