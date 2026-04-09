import { createLazyRoute } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { ChatBox } from './ChatBox';
import { SidebarTools } from './SidebarTools';

const ProjectPage = () => {
  return (
    <div className="flex h-full">
      <Sidebar />

      <ChatBox />

      <div className="flex-1 flex flex-col">
        <div className="h-9 border-b"></div>

        <div className="flex-1 flex">
          <div className="flex-1 flex">
            <iframe
              className="flex-1 shadow"
              // src="https://www.bilibili.com/video/BV1BhXYBRE6c/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click"
              src="https://z.ai/subscribe?code=authcode_MYPDcpdZhT_bMx4AhRqokr2iFIznR5iqfU89AG745yc&state=5dbf2a57d7b6b180b14f7bc177cc7198"
            />
          </div>

          <SidebarTools className="w-9 border-l" />
        </div>

        <div className="h-9 border-t"></div>
      </div>
    </div>
  );
};

export const Route = createLazyRoute('/app/project')({
  component: ProjectPage,
});
