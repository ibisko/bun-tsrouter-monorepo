import { Button, cn, Dialog } from '@packages/ui';
import { pascalize } from '@/utils/string';
import { useEffect, useRef, useState } from 'react';
import * as MonacoEditor from 'monaco-editor';
// import { useSnapshot } from 'valtio';
// import { themeStore } from '@/stores/theme';
import { Api } from '@/api';
import { ElShoppingCartSign, type IconInfo } from '@packages/icons';
import { toast } from 'sonner';

type SvgIconProps = {
  className?: string;
  item: IconInfo & { filePath?: string };
};
export const SvgIcon = ({ className, item }: SvgIconProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Dialog
      title={item.key}
      trigger={
        <div className={cn('p-1 cursor-pointer group', { 'bg-primary/20': item.isAnimate }, className)} onClick={() => setVisible(true)}>
          <SVG className="group-hover:bg-primary/40 cursor-pointer" item={item} />
        </div>
      }
      open={visible}
      cancel={() => setVisible(false)}>
      <DialogContent item={item} cancel={() => setVisible(false)} />
    </Dialog>
  );
};

type DialogContentProps = SvgIconProps & {
  cancel: () => void;
};
const DialogContent = ({ item, cancel }: DialogContentProps) => {
  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | undefined>(undefined);
  const iTextModelRef = useRef<MonacoEditor.editor.ITextModel | undefined>(undefined);
  const divRef = useRef<HTMLDivElement>(null);
  const [filePath, setFilePath] = useState(item.filePath);
  const [fileName, setFileName] = useState('');
  // const { isDark } = useSnapshot(themeStore);

  async function initial() {
    const dom = divRef.current;
    if (!dom) return;

    let res;
    if (item.filePath) {
      res = await Api.iconify.local.viewIconFile.get({ filePath: item.filePath });
    } else {
      res = await Api.iconify.local.reactCompoment.post(item);
    }
    setFileName(res.fileName);
    const code = res.code;

    // 如果 editor 已存在，只更新内容
    if (editorRef.current) {
      editorRef.current.setValue(code);
      return;
    }

    iTextModelRef.current = MonacoEditor.editor.createModel(
      code,
      'typescript', // 基础语言类型
      MonacoEditor.Uri.parse('file:///main.tsx'), // 必须是 .tsx 关键：有了这个 Uri，Monaco 才会启用 JSX 语法服务
    );

    // 首次创建 editor
    editorRef.current = MonacoEditor.editor.create(dom, {
      model: iTextModelRef.current,
      // theme: isDark ? 'vs-dark' : 'vs',
      wordWrap: 'on', // 文本溢出自动换行
      scrollBeyondLastLine: false, // 底部空白滚动
      readOnly: true,
    });
  }

  useEffect(() => {
    initial();

    return () => {
      editorRef.current?.dispose();
      iTextModelRef.current?.dispose();
      editorRef.current = undefined;
    };
  }, []);

  const appendIcon = async () => {
    const { filePath } = await Api.iconify.local.appendIcon.post({
      key: item.key,
      top: item.top,
      left: item.left,
      width: item.width,
      height: item.height,
      prefix: item.prefix,
      body: item.body,
      isAnimate: item.isAnimate,
    });
    setFilePath(filePath);
    toast.success(`添加图标成功 ${pascalize(item.key)}.tsx`);
  };

  return (
    <>
      <div className="flex gap-4">
        <div>
          <SVG className="size-32" item={item} />

          <div className="flex justify-center gap-2 text-xs mt-2">
            <span>{`(${item.left},${item.top})`}</span>
            <span>{`${item.width}x${item.height}`}</span>
          </div>
        </div>

        <div className="flex-1 xl:w-[60vw] not-xl:w-[80vw] min-h-80 shadow" ref={divRef}></div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          className=""
          variant="outline"
          onClick={() => {
            window.location.assign(`vscode://file/${filePath}`);
          }}
          disabled={!filePath}>
          Open in Vscode
        </Button>

        <Button className="" variant="outline" onClick={cancel}>
          Cancel
        </Button>

        {/* local 就重写 */}
        <Button className="" variant={item.filePath ? 'outline' : 'default'} onClick={appendIcon}>
          {item.filePath ? 'Rewrite' : 'Add'} <span className="">{fileName}</span>
          <ElShoppingCartSign className="size-5" />
        </Button>
      </div>
    </>
  );
};

export const SVG = ({ className, item }: SvgIconProps) => {
  return (
    <svg
      className={cn('', className)}
      style={{
        backgroundSize: '8px',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="rgba(0,0,0,0.05)" d="M0 0h16v16H0zm16 16h16v16H16z"/><path fill="rgba(255,255,255,0.05)" d="M0 16h16v16H0zM16 0h16v16H16z"/></svg>')`,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${item.left} ${item.top} ${item.width} ${item.height}`}
      width="1em"
      height="1em"
      dangerouslySetInnerHTML={{
        __html: item.body,
      }}></svg>
  );
};
