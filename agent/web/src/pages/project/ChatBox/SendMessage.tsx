import { IconoirSendSolid, MdiExportVariant } from '@packages/icons';
import { Button, cn, Textarea } from '@packages/ui';
import { useState, type KeyboardEvent } from 'react';

type SendMessageProps = {
  className?: string;
  sendMessage: (data: string) => void;
  output: () => void;
};

export const SendMessage = ({ className, sendMessage, output }: SendMessageProps) => {
  const [value, setValue] = useState('对于执行agent任务的llm，区分经济模型和高级模型，对不同类型的任务怎么规划会比较合理呢');

  const handleSend = () => {
    if (!value.trim()) return;
    console.log(value);
    setValue('');
    sendMessage(value);
  };

  return (
    <div className={cn('opacity-0 hover:opacity-100 transition duration-300', { 'opacity-100': !!value }, className)}>
      <div className="p-3 border rounded-lg bg-background/85 backdrop-blur-xs">
        <EditorContent value={value} setValue={setValue} send={handleSend} />

        <div className="flex gap-2">
          <Button className="ml-auto" variant="outline" size="icon-sm" onClick={output}>
            <MdiExportVariant className="size-6" />
          </Button>
          <Button className="" size="icon-sm" onClick={handleSend}>
            <IconoirSendSolid className="-rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
};

type EditorContentProps = {
  value: string;
  setValue: (text: string) => void;
  send: () => void;
};
const EditorContent = ({ value, send, setValue }: EditorContentProps) => {
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isSendEvent = e.code === 'Enter' && !e.shiftKey;
    if (!isSendEvent) return;
    e.preventDefault();
    send();
  };

  return (
    <Textarea
      className={cn('border-none dark:bg-transparent shadow-none', 'focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none')}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="What's wrong with you?"
      maxRows={24}
      onKeyDown={onKeyDown}
    />
  );
};
