import type { GPT } from '@packages/gpt';
import { cn } from '@packages/ui';
import { BaseMessage } from './BaseMessage';

type UserMessageProps = {
  className?: string;
  content: GPT.Content;
  created: number;
  footer?: React.ReactNode;
};

export const UserMessage = ({ className, content, created, footer }: UserMessageProps) => {
  return (
    <BaseMessage className={cn(' bg-primary text-background dark:text-foreground', className)} created={created} side="right" footer={footer}>
      <pre className="wrap-break-word text-sm text-wrap font-LXGWWenKaiMono">
        {content.map((item, index) => (
          <div key={index}>{item.text.trim()}</div>
        ))}
      </pre>
    </BaseMessage>
  );
};
