import { IconoirSendSolid, StashArrowRetryDuotone } from '@packages/icons';
import { Button, cn, ContentEditable } from '@packages/ui';
import { useState } from 'react';

type SendMessageProps = {
  className?: string;
  sendMessage: (data: string) => void;
  retry: () => void;
};

export const SendMessage = ({ className, retry, sendMessage }: SendMessageProps) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    console.log(value);
    sendMessage(value);
    setValue('');

    // todo useChatGpt
    // Api.gpt.chat.chat.sse({ text: value });
  };

  return (
    <div className={cn('', className)}>
      <div className="p-3 border rounded-lg bg-background/85 backdrop-blur-xs">
        <ContentEditable value={value} onChange={setValue} onSend={handleSend} placeholder="What's wrong with you?" />

        <div className="flex gap-2 mt-2">
          <Button className="ml-auto" variant="outline" size="icon-sm" onClick={retry}>
            <StashArrowRetryDuotone className="size-6" />
          </Button>
          <Button className="" size="icon-sm" onClick={handleSend}>
            <IconoirSendSolid className="-rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
};
