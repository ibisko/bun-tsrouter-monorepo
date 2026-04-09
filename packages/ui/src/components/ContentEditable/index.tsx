import { useEffect, useRef, useState } from 'react';

interface ContentEditableProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSend?: () => void;
}

export const ContentEditable = ({ value, onChange, placeholder, onSend }: ContentEditableProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const composingRef = useRef(false);
  const lastValueRef = useRef('');
  const [composing, setComposing] = useState(false);

  const triggerChange = (text: string) => {
    if (lastValueRef.current !== text) {
      lastValueRef.current = text;
      onChange(text);
    }
  };

  const focusToEnd = () => {
    if (!ref.current) return;
    ref.current.focus();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
      lastValueRef.current = value;
    }
  }, [value]);

  return (
    <div className="max-h-96 min-h-14 cursor-text overflow-auto whitespace-break-spaces" onClick={focusToEnd}>
      <div className="relative text-sm">
        <div
          className="outline-none"
          ref={ref}
          contentEditable="true"
          onInput={() => {
            if (composingRef.current) return;
            triggerChange(ref.current!.textContent ?? '');
          }}
          onCompositionStart={() => {
            composingRef.current = true;
            setComposing(true);
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
            setComposing(false);
            triggerChange(ref.current!.textContent ?? '');
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !composingRef.current) {
              e.preventDefault();
              onSend?.();
            }
          }}
        />
        {placeholder && !value && !composing && <span className="pointer-events-none absolute top-0 left-0 text-foreground/50">{placeholder}</span>}
      </div>
    </div>
  );
};
