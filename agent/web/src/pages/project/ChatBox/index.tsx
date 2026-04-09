import { IconoirSendSolid } from '@packages/icons';
import { Button, ContentEditable } from '@packages/ui';
import { useState } from 'react';

export const ChatBox = () => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    console.log(value);
    setValue('');

    // todo useChatGpt
    // Api.gpt.chat.chat.sse({ text: value });
  };

  return (
    <div className="flex flex-col border-r p-2 w-[330px] overflow-hidden">
      <div className="">Chat box</div>

      <div className="flex-1 overflow-auto">{/* todo对话内容 */}</div>

      <div className=" border rounded-lg p-3">
        <ContentEditable value={value} onChange={setValue} onSend={handleSend} placeholder="你有什么问题？" />

        <div className="flex mt-2">
          <Button className="ml-auto" size="icon-sm" onClick={handleSend}>
            <IconoirSendSolid className="-rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
};
