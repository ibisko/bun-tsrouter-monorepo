import { Marked } from '@/components/Marked';
import type { GPT } from '@packages/gpt';
import { MingcuteDownFill } from '@packages/icons';
import { cn, Collapse } from '@packages/ui';
import { useState } from 'react';
import { BaseMessage } from './BaseMessage';

type AssistantMessageProps = {
  className?: string;
  content: GPT.Content;
  thinking?: string;
  created: number;
  footer?: React.ReactNode;
};

export const AssistantMessage = ({ className, content, thinking, created, footer }: AssistantMessageProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <BaseMessage className={cn('bg-background', className)} created={created} side="left" footer={footer}>
      {thinking && (
        <div
          className="relative"
          onClick={() => {
            if (!expand) setExpand(true);
          }}>
          <Collapse className={cn('w-full mb-4 text-xs text-foreground/50 opacity-100 hover:bg-foreground/5')} innerClassName="min-h-8" open={expand}>
            <Marked content={thinking.trim()} />
          </Collapse>
          <div className={cn('absolute right-0 flex', expand ? '-bottom-4' : 'bottom-0 ')} onClick={() => setExpand(!expand)}>
            <MingcuteDownFill className={cn('ml-auto bg-foreground/10 cursor-pointer', expand ? 'rotate-180' : 'rotate-90')} />
          </div>
        </div>
      )}
      {content.map((item, index) => (
        <Marked content={item.text.trim()} key={index} />
      ))}
    </BaseMessage>
  );
};
