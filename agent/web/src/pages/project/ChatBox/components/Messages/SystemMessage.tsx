import { Marked } from '@/components/Marked';
import type { GPT } from '@packages/gpt';
import { cn } from '@packages/ui';
import { BaseMessage } from './BaseMessage';

type SystemMessageProps = {
  className?: string;
  content: GPT.Content;
  created: number;
};

export const SystemMessage = ({ className, content, created }: SystemMessageProps) => {
  return (
    <BaseMessage className={cn('p-0 border-none', className)} side="mid" created={created}>
      {content.map((item, index) => (
        <Marked content={item.text.trim()} key={index} />
      ))}
    </BaseMessage>
  );
};
