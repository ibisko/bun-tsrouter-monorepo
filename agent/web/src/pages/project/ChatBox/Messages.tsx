import type { Context, GPT } from '@packages/gpt';
import { EosIconsThreeDotsLoading } from '@packages/icons';
import { cn, Reveal } from '@packages/ui';
import { useEffect, useRef } from 'react';

type MessagesContextProps = {
  className?: string;
  context: Context[];
  loading: boolean;
};
export const MessagesContext = ({ className, context, loading }: MessagesContextProps) => {
  const contextRef = useRef<HTMLDivElement>(null);
  const isAutoScrollRef = useRef(true);
  const prevScrollTopRef = useRef(0);

  const scrollToBotttom = () => {
    if (contextRef.current) {
      contextRef.current.scrollTo({ top: contextRef.current.scrollHeight });
    }
  };

  const handleScroll = () => {
    if (!contextRef.current) return;
    const { scrollTop } = contextRef.current;
    if (scrollTop < prevScrollTopRef.current) {
      isAutoScrollRef.current = false;
    }
    if (contextRef.current.scrollHeight - scrollTop - contextRef.current.clientHeight < 50) {
      isAutoScrollRef.current = true;
    }
    prevScrollTopRef.current = scrollTop;
  };

  useEffect(() => {
    if (isAutoScrollRef.current || loading) {
      scrollToBotttom();
    }
  }, [context, loading]);

  return (
    <div ref={contextRef} className={cn('flex-1 text-sm overflow-y-auto', className)} onScroll={handleScroll}>
      {context.map(item => {
        switch (item.role) {
          case 'assistant':
            return <AssistantMessage content={item.content} thinking={item.thinking} date={new Date(item.created)} key={item.id} />;
          case 'system':
            return <SystemMessage content={item.content} date={new Date(item.created)} key={item.id} />;
          case 'tool':
            return <SystemMessage content={item.content} date={new Date(item.created)} key={item.id} />;
          case 'user':
            return <UserMessage content={item.content} date={new Date(item.created)} key={item.id} />;
        }
      })}

      <div className={cn('justify-center hidden', { flex: loading })}>
        <EosIconsThreeDotsLoading className="size-10" />
      </div>
    </div>
  );
};

// ========================================================================================

type AssistantMessageProps = {
  className?: string;
  content: GPT.Content;
  thinking?: string;
  date: Date;
};
export const AssistantMessage = ({ className, content, thinking, date }: AssistantMessageProps) => {
  return (
    <BaseMessage className={cn('bg-background', className)} date={date} side="left">
      {thinking && <div className="pb-4 text-xs text-foreground/50">{thinking}</div>}
      {content.map((item, index) => (
        <div key={index}>{item.text}</div>
      ))}
    </BaseMessage>
  );
};

type UserMessageProps = {
  className?: string;
  content: GPT.Content;
  date: Date;
};
export const UserMessage = ({ className, content, date }: UserMessageProps) => {
  return (
    <BaseMessage className={cn(' bg-primary text-background dark:text-foreground', className)} date={date} side="right">
      {content.map((item, index) => (
        <div key={index}>{item.text}</div>
      ))}
    </BaseMessage>
  );
};

type SystemMessageProps = {
  className?: string;
  content: GPT.Content;
  date: Date;
};
export const SystemMessage = ({ className, content, date }: SystemMessageProps) => {
  return (
    <BaseMessage className={cn('p-0 border-none', className)} side="mid" date={date}>
      {content.map((item, index) => (
        <div key={index}>{item.text}</div>
      ))}
    </BaseMessage>
  );
};

// ========================================================================================

type BaseMessageProps = {
  className?: string;
  date?: Date;
  children: React.ReactNode;
  side: 'left' | 'mid' | 'right';
};
const BaseMessage = ({ className, date, children, side }: BaseMessageProps) => {
  return (
    <div className={cn('relative flex flex-col justify-end px-1.5 py-1 group hover:bg-foreground/5')}>
      {date && (
        <Reveal
          className={cn(
            'text-nowrap text-xs text-foreground/80',
            'delay-0 group-hover:delay-1000 group-hover:opacity-100 group-hover:grid-rows-[1fr]',
            { 'mr-auto': side === 'left' },
            { 'mx-auto': side === 'mid' },
            { 'ml-auto': side === 'right' },
          )}>
          {date.toLocaleString()}
        </Reveal>
      )}

      <pre
        className={cn(
          'rounded-lg p-2 max-w-full wrap-break-word border text-sm text-wrap font-LXGWWenKaiMono',
          { 'mr-auto': side === 'left' },
          { 'mx-auto': side === 'mid' },
          { 'ml-auto': side === 'right' },
          className,
        )}>
        {children}
      </pre>

      {/* todo tools */}
    </div>
  );
};
