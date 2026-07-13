import { cn, inputClass } from '@/main';
import type { MaybePromise } from 'bun';
import { useRef, useCallback, useEffect, type TextareaHTMLAttributes, useState } from 'react';

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue'> & {
  maxRows?: number;
  value?: string | null;
  onTextChange?: (text: string) => MaybePromise<string | void>;
};

export function Textarea({ className, rows = 3, maxRows = 8, value, onTextChange, ...props }: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const [val, setVal] = useState(value ?? '');
  useEffect(() => {
    setVal(value ?? '');
  }, [value]);

  const adjustHeight = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = maxRows ? lineHeight * maxRows : Infinity;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [maxRows]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  return (
    <textarea
      ref={ref}
      className={cn(inputClass, 'h-auto resize-none', className)}
      rows={rows}
      value={val}
      onInput={async e => {
        const target = e.target as HTMLTextAreaElement;
        const text = target.value;
        setVal(text);
        if (composingRef.current) return;
        adjustHeight();
        const resetVal = await onTextChange?.(text);
        if (resetVal) {
          setVal(resetVal);
        }
      }}
      onCompositionStart={() => (composingRef.current = true)}
      onCompositionEnd={e => {
        composingRef.current = false;
        const target = e.target as HTMLTextAreaElement;
        onTextChange?.(target.value);
      }}
      {...props}
      spellCheck={false}
    />
  );
}
