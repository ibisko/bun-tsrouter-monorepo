import type { Context } from '@packages/gpt';
import { EosIconsThreeDotsLoading, StashArrowRetryDuotone } from '@packages/icons';
import { Button, cn } from '@packages/ui';
import { useEffect, useRef } from 'react';
import { AssistantMessage } from './AssistantMessage';
import { SystemMessage } from './SystemMessage';
import { UserMessage } from './UserMessage';

type MessagesContextProps = {
  className?: string;
  context: Context[];
  loading: boolean;
  retry: (id: number) => Promise<void>;
};
export const MessagesContext = ({ className, context, loading, retry }: MessagesContextProps) => {
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
    <div ref={contextRef} className={cn('flex-1 text-sm overflow-x-hidden overflow-y-auto', className)} onScroll={handleScroll}>
      {context.map(item => {
        switch (item.role) {
          case 'assistant':
            return <AssistantMessage content={item.content} thinking={item.thinking} created={item.created} key={item.id} />;
          case 'system':
            return <SystemMessage content={item.content} created={item.created} key={item.id} />;
          case 'tool':
            return <SystemMessage content={item.content} created={item.created} key={item.id} />;
          case 'user':
            return (
              <UserMessage
                content={item.content}
                created={item.created}
                footer={
                  <Button className="ml-auto" variant="outline" onClick={() => retry(item.id)} size="icon-sm">
                    <StashArrowRetryDuotone className="size-6" />
                  </Button>
                }
                key={item.id}
              />
            );
        }
      })}

      <div className={cn('justify-center hidden', { flex: loading })}>
        <EosIconsThreeDotsLoading className="size-10" />
      </div>
    </div>
  );
};
