# fs - File System Utilities

文件系统工具，用于递归遍历目录结构并返回树形结构。

## TRIGGER

当用户需要查看目录结构、列出文件、扫描文件夹时调用。

## Request

```ts
type Request = {
  /** 需要扫描的路径 */
  path: string;
  /** 排除的文件名模式（支持 glob 模式），可选 */
  excludes?: string[];
};
```

## Response

```ts
type Response = TreeNode[];
```

```ts
type FileNode = {
  type: 'file';
  name: string;
  filePath: string;
};

type DirNode = {
  type: 'dir';
  name: string;
  filePath: string;
  children: TreeNode[];
};

type TreeNode = FileNode | DirNode;
```

## Default Excludes

以下模式会自动添加到排除列表中：

- `.DS_Store` - macOS 系统文件
- `node_module` - Node.js 依赖目录
- `dist` - 构建输出目录

## Example

**Request:**

```json
{
  "path": "/project/src",
  "excludes": ["*.log", "*.test.ts"]
}
```

**Response:**

```json
[
  {
    "type": "dir",
    "name": "components",
    "filePath": "/project/src/components",
    "children": [
      {
        "type": "file",
        "name": "Button.tsx",
        "filePath": "/project/src/components/Button.tsx"
      }
    ]
  },
  {
    "type": "file",
    "name": "index.ts",
    "filePath": "/project/src/index.ts"
  }
]
```

## Notes

- 使用 `minimatch` 库进行 glob 模式匹配
- 目录优先于文件排列在结果数组的前面
- 排除模式使用 glob 语法，例如 `*.log`、`temp*`、`**/*.test.ts`

# 添加文件到指定目录

```ts
type Request = {
  path: string;
  rootPath: string;
  content: string;
};
```

# 修改指定文件

```ts
type Request = {
  path: string;
  rootPath: string;
  changes: (Change | Delete | Add)[];
};

type Change = {
  type: 'change';
  lineIndex: number; // 替换源文件的哪一行
  content: string; // 替换的内容
};
type Delete = {
  type: 'delete';
  lineIndex: number; // 删除源文件的哪一行
};
type Add = {
  type: 'add';
  lineIndex: number; // 在哪一行下面添加内容
  content: string;
};
```
