import { cn, inputClass } from '@/main';
import { useRef, useCallback, useEffect, type TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { maxRows?: number };

export function Textarea({ className, rows = 3, maxRows = 8, onInput, value, ...props }: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

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
  }, [value, adjustHeight]);

  return (
    <textarea
      ref={ref}
      className={cn(inputClass, 'h-auto resize-none', className)}
      rows={rows}
      value={value}
      onInput={e => {
        adjustHeight();
        onInput?.(e);
      }}
      {...props}
      spellCheck={false}
    />
  );
}
