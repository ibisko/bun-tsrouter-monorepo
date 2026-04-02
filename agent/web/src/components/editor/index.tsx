import { cn } from '@packages/ui';
import { editor } from 'monaco-editor';
import { useEffect, useRef, type RefObject } from 'react';

const useEditor = (divRef: RefObject<HTMLDivElement | null>, content: string, language: string) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | undefined>(undefined);

  // Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq
  // You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker

  useEffect(() => {
    const dom = divRef.current;
    if (!dom) return;

    // 如果 editor 已存在，只更新内容
    if (editorRef.current) {
      editorRef.current.setValue(content);
      return;
    }

    // 首次创建 editor
    editorRef.current = editor.create(dom, {
      value: content,
      language: language,
      automaticLayout: true,
      theme: 'vs-dark',
      minimap: { enabled: false },
      wordWrap: 'on', // 文本溢出自动换行
      // lineNumbers: 'off', // 行号
      // scrollBeyondLastLine: false, // 底部空白滚动
    });
  }, [content]);

  useEffect(() => {
    return () => {
      console.log('RETURN ()=>');
      editorRef.current?.dispose();
      editorRef.current = undefined;
    };
  }, []);
};

type EditorProps = {
  className?: string;
  content: string;
  language: string;
};
export const MonacoEditor = ({ className, content, language }: EditorProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  useEditor(divRef, content, language);
  return <div className={cn('h-full', className)} ref={divRef}></div>;
};
