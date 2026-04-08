import { iconifyApi } from './api';
import { Button, Input, Tooltip } from '@packages/ui';
import { useIconSets } from './useIconSets';
import { SvgIcon } from './IconSvg';

export const IconSets = () => {
  const { svgs, collections, setSearchValue, search } = useIconSets();
  return (
    <div className="">
      <div className="font-black">Icon Sets</div>

      <div className="flex gap-2 mt-2 px-1 py-2 bg-background sticky top-0">
        <Input onChange={e => setSearchValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
        <Button onClick={search}>Search</Button>
      </div>
      {/**
       * 点击菜单
       * - 预览日夜主题效果
       * - 可添加到本地
       * - 可移除本地
       * - 可编辑内容，微调内容
       *
       * - 可编辑内容
       * - 检查本地引用情况，哪些文件引入了
       */}
      <div className="flex flex-wrap mt-2">
        {svgs.map(item => (
          <SvgIcon item={item} key={item.key} />
        ))}
      </div>

      <div className="flex flex-wrap text-wrap gap-2 mt-4">
        {collections.map(item => (
          <Tooltip title={item.key} key={item.key} orientation="top">
            <div
              className="border rounded-lg p-2 shadow"
              onClick={async () => {
                //   console.log(item);
                const response = await iconifyApi.collection({ prefix: item.key, info: true, chars: true });
                console.log(response);
                // if (Array.isArray(response.uncategorized)) {
                // }
              }}>
              <div className="font-black">{item.name}</div>
              <div className="text-center text-xs">
                {/* <div>{item.licenseTitle}</div> */}
                {/* <div>{item.total} icons</div> */}
                <div>({item.total})</div>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
