import { Iconify } from '@/components/iconify';
import { createLazyRoute } from '@tanstack/react-router';

const IframePage = () => {
  return (
    <div className="flex w-full h-full p-8">
      {/* <iframe
        className="flex-1"
        src="https://www.bilibili.com/video/BV1BhXYBRE6c/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click"
      /> */}
      <Iconify />
    </div>
  );
};

export const Route = createLazyRoute('/app/iframe')({
  component: IframePage,
});
