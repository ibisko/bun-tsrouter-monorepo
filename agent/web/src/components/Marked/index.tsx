import { cn } from '@packages/ui';
import { useEffect, useMemo, useRef } from 'react';
import { Marked as MarkedClass } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import './styles.css';
import 'highlight.js/styles/github-dark.min.css';

const markedInstance = new MarkedClass(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
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
