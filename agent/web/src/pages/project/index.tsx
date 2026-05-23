import { createLazyRoute } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { ChatBox } from './ChatBox';
import { CodiconListTree, LineMdBellLoop, MaterialSymbolsIframeOutlineRounded, StreamlineUltimateBrowserPageLayout } from '@packages/icons';
import { Button } from '@packages/ui';
import { useRef, useState } from 'react';
import { Group, Panel } from 'react-resizable-panels';

const LOCAL_STORAGE_CHATBOX_RESIZE = 'chatbox.resize';

const ProjectPage = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url] = useState('http://127.0.0.1:5174/app/components');
  // const [url] = useState('https://www.bilibili.com/video/BV1BhXYBRE6c/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click');

  // todo 设计个 iframe 通信插件
  // iframeRef.current?.contentWindow?.postMessage({ type: 'ping' }, 'http://127.0.0.1:5174');

  const [defaultSize] = useState(() => {
    const defaultSize = localStorage.getItem(LOCAL_STORAGE_CHATBOX_RESIZE);
    return defaultSize ? +defaultSize : 430;
  });

  return (
    <Group className="flex h-full font-LXGWWenKaiMono">
      <Sidebar />

      <Panel
        defaultSize={defaultSize}
        minSize={330}
        maxSize={'80%'}
        onResize={e => {
          localStorage.setItem(LOCAL_STORAGE_CHATBOX_RESIZE, `${e.inPixels}`);
        }}>
        <ChatBox />
      </Panel>

      {/* <Panel className="flex-1 flex flex-col">
        <div className="border-b py-2">
          <div className="flex gap-1.5 items-center h-full px-2">
            <div className="flex items-center gap-1 px-2 py-0.5 border rounded-lg mr-auto">
              <MaterialSymbolsIframeOutlineRounded />
              <span className="text-xs">{url}</span>
            </div>

            <Button size="icon-sm" variant="outline">
              <LineMdBellLoop />
            </Button>
            <Button size="icon-sm" variant="ghost">
              <CodiconListTree />
            </Button>
            <Button size="icon-sm">
              <StreamlineUltimateBrowserPageLayout className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          <iframe ref={iframeRef} className="flex-1 shadow" src={url} />
        </div>
      </Panel> */}
    </Group>
  );
};

export const Route = createLazyRoute('/app/project')({
  component: ProjectPage,
});
