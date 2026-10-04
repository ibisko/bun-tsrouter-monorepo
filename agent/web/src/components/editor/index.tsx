import { themeStore } from '@/stores/theme';
import { cn } from '@packages/ui';
import { merge } from 'lodash-es';
import { editor, Uri } from 'monaco-editor';
import { useEffect, useRef } from 'react';

type EditorProps = {
  className?: string;
  language: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  value?: string;
  onChange?: (value: string) => void;
};

export const MonacoEditor = ({ className, value, language, options, onChange }: EditorProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const iTextModelRef = useRef<editor.ITextModel | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
      automaticLayout: true,
      theme: themeStore.isDark ? 'vs-dark' : 'vs',
      minimap: { enabled: false },
      // wordWrap: 'on', // 文本溢出自动换行
      unicodeHighlight: {
        nonBasicASCII: false,
        ambiguousCharacters: false,
      },
    };

    editorRef.current = editor.create(divRef.current, merge(defaultOptions, options));

    iTextModelRef.current = editor.createModel(value ?? '', language, Uri.file('default.tsx'));
    editorRef.current.setModel(iTextModelRef.current);

    editorRef.current.onDidChangeModelContent(() => {
      const val = editorRef.current?.getValue() ?? '';
      onChange?.(val);
    });

    return () => {
      iTextModelRef.current?.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  // 外部 value 变化时同步到 editor（仅在内容真正不同时）
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.getValue() === value) return;
    editorRef.current.setValue(value ?? '');
  }, [value]);

  return (
    <div className={cn('relative h-full', className)}>
      <div className={cn('absolute w-full h-full')} ref={divRef}></div>;
    </div>
  );
};
