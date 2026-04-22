import { MessagesContext } from './Messages';
import { SendMessage } from './SendMessage';
import { useChatContext } from './useChatContext';

export const ChatBox = () => {
  const { context, sendMessage, retry, loading } = useChatContext();
  return (
    <div className="relative flex flex-col h-full bg-card border-r overflow-x-hidden overflow-y-auto">
      <MessagesContext context={context} loading={loading} />
      <SendMessage className="sticky left-0 bottom-3 w-full px-1.5" sendMessage={sendMessage} retry={retry} />
    </div>
  );
};
