import { cn } from '@packages/ui';
import { useEffect, useMemo, useRef } from 'react';
import { Marked as MarkedClass } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import './styles.css';

const markedInstance = new MarkedClass(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      switch (language) {
        case 'json':
          try {
            code = JSON.stringify(JSON.parse(code), null, 2);
          } catch {
            /* empty */
          }
          break;
        // todo 可接口提供格式化
      }
      return hljs.highlight(code, { language }).value;
    },
  }),
);

type MarkedProps = {
  className?: string;
  content: string;
};

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
