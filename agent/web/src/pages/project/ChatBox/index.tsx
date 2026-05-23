import { MessagesContext } from './components/Messages';
import { SendMessage } from './SendMessage';
import { useChatContext } from './useChatContext';

export const ChatBox = () => {
  const { context, sendMessage, retry, loading, output } = useChatContext();
  return (
    <div className="relative flex flex-col h-full bg-card border-r overflow-x-hidden overflow-y-auto">
      <MessagesContext className="pt-4 pb-48" context={context} loading={loading} retry={retry} />
      <SendMessage className="absolute left-0 bottom-3 w-full px-1.5" sendMessage={sendMessage} output={output} />
    </div>
  );
};
