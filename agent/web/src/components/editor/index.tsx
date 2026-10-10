import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cn } from '@packages/ui';
import { useSnapshot } from 'valtio';
import { themeStore } from '@/stores/theme';

type EditorProps = {
  className?: string;
  height?: 'auto' | `${number}px` | `${number}%`;
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export const CodemirrorEditor = ({ className, value, height = '100%', readOnly, onChange }: EditorProps) => {
  const { isDark } = useSnapshot(themeStore);

  return (
    <CodeMirror
      className={cn(className)}
      value={value}
      height={height}
      extensions={[javascript({ jsx: true, typescript: true }), EditorView.lineWrapping]}
      onChange={onChange}
      theme={isDark ? 'dark' : 'light'}
      readOnly={readOnly}
    />
  );
};
