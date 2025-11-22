import { cn } from '@/main';

type PreCodeProps = {
  className?: string;
  content: string;
  type: string;
};
export const PreCode = ({ className, content, type }: PreCodeProps) => {
  return (
    <div>
      <div>
        <div>{type}</div>
      </div>
      <pre className={cn('flex-1 w-56 block break-words whitespace-pre overflow-hidden', className)}>
        <code className="break-words whitespace-pre">{content}</code>
        {/* {content} */}
      </pre>
    </div>
  );
};
