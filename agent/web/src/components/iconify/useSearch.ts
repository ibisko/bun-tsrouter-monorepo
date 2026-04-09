import { useState } from 'react';
import { iconifyApi } from './api';
import type { IconInfo } from '@packages/icons';
import { iconifyStore } from '@/stores/iconify';

export const useSearch = () => {
  const [svgs, setSvgs] = useState<IconsListItem[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [iconListKey, setIconListKey] = useState(0);

  const search = async () => {
    if (!searchValue) {
      setSvgs([]);
      setIconListKey(e => ++e);
      return;
    }
    const response = await iconifyApi.search({ query: searchValue, limit: 999 });

    const prefixIcons = response.icons.reduce<Record<string, string[]>>((res, item) => {
      const [prefix, id] = item.split(':');
      if (res[prefix]) {
        res[prefix].push(id);
      } else {
        res[prefix] = [id];
      }
      return res;
    }, {});

    setSvgs([]);

    const blockSize = 20;
    let index = 0;
    const result: typeof svgs = [];

    for (const [prefix, ids] of Object.entries(prefixIcons)) {
      const target = response.collections[prefix];
      const size = target.displayHeight || target.height;
      if (ids.length <= blockSize) {
        result.push({
          key: `${prefix}-${index}`,
          icons: { prefix, ids, size },
        });
        index++;
      } else {
        const groups: string[][] = [];
        for (let i = 0; i < ids.length; i += blockSize) {
          const group = ids.slice(i, i + blockSize);
          if (group.length < blockSize && groups.length > 0) {
            groups.at(-1)!.push(...group);
          } else {
            groups.push(group);
          }
        }
        for (const group of groups) {
          result.push({
            key: `${prefix}-${index}`,
            icons: { prefix, ids: group, size },
          });
          index++;
        }
      }
    }

    setSvgs(result);
    setIconListKey(e => ++e);
  };

  return {
    iconListKey,
    svgs,
    setSearchValue,
    search,
  };
};

export const fetchIcons = async ({ prefix, ids, size }: IconsListIds, cb: (icon: IconInfoMM, index: number) => void) => {
  const response = await iconifyApi.icons(prefix, ids);
  let index = 0;
  for (const id of ids) {
    const aliase = response.aliases[id];
    const aliaseResponseIconId = aliase?.parent ?? id;
    const iconInfo = response.icons[aliaseResponseIconId];
    const body = iconInfo?.body;
    if (!body) {
      console.log('no body', { prefix, aliaseResponseIconId, response });
      continue;
    }

    /**
     * 注意默认大小就是 16
     * https://iconify.design/docs/types/iconify-json.html#icon
     */
    const height = iconInfo.height || response.height || size || 16;
    const width = iconInfo.width || response.width || height;
    const top = iconInfo.top || 0;
    const left = iconInfo.left || 0;
    if (!(response.height || size)) {
      console.log('no height', response);
    }
    const key = `${prefix}:${id}`;
    const existsLocal = iconifyStore.localIcons.find(item => item.key === key);

    const data: IconInfoMM = {
      key,
      top,
      left,
      width,
      height,
      body,
      prefix,
      isAnimate: body.includes('<animate'),
      filePath: existsLocal?.filePath,
    };

    cb(data, index);
    index++;
  }
};

type IconInfoMM = IconInfo & { filePath?: string };

export type IconsListItem = {
  /** prefix-1 */
  key: string;
  icons: IconsListIds;
};

export type IconsListIds = {
  prefix: string;
  ids: string[];
  size: number;
};
