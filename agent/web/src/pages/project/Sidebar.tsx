import { Api } from '@/api';
import { Iconify } from '@/components/iconify';
import { themeActions } from '@/stores/theme';
import {
  FluentDarkTheme24Filled,
  MaterialSymbolsHistory2Rounded,
  MaterialSymbolsLightChatBubble,
  MdiWeb,
  TdesignChatBubbleAdd,
} from '@packages/icons';
import { Button } from '@packages/ui';

export const Sidebar = () => {
  const webSearch = async () => {
    // const res = await Api.tools.webSearch.openBigModel.post({
    const res = await Api.tools.webSearch.gemini.post({
      // search: '最近openai新出的图像生成模型',
      // search: '最近tailwindcss最新版本',
      search: '查一下最新的tailwindcss版本，以及最新的具体的发布的时间',
    });
    console.log(res);
  };

  const chatTest = async () => {
    await Api.chat.sendMessage.post({ text: '我想调研酱香饼不同做法对美味程度的影响，有没有相关的文献，带DOI号' });
  };

  return (
    <div className="flex flex-col items-center gap-2 px-1 py-4 text-xl border-r">
      <Button size="icon-sm" variant="ghost" onClick={webSearch}>
        <MdiWeb />
      </Button>

      <Button size="icon-sm" variant="ghost" onClick={chatTest}>
        <MaterialSymbolsLightChatBubble />
      </Button>

      <Button size="icon-sm" variant="ghost">
        <TdesignChatBubbleAdd />
      </Button>

      <Button size="icon-sm" variant="ghost">
        <MaterialSymbolsHistory2Rounded />
      </Button>

      <Iconify />

      <div className="mt-auto">
        <Button className="" variant="ghost" size="icon-sm" onClick={themeActions.switchTheme}>
          <FluentDarkTheme24Filled className="size-5" />
        </Button>
      </div>
    </div>
  );
};
