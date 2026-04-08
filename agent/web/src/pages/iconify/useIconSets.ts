import { useEffect, useState } from 'react';
import { iconifyApi } from './api';
import type { IconInfo } from '@packages/icons';
import { iconifyStore } from '@/stores/iconify';

export const useIconSets = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [svgs, setSvgs] = useState<(IconInfo & { filePath?: string })[]>([]);
  const [searchValue, setSearchValue] = useState<string>();

  const initail = async () => {
    const response = await iconifyApi.collections();
    const _collections: Collection[] = [];
    for (const [key, item] of Object.entries(response)) {
      _collections.push({
        key,
        name: item.name,
        authorName: item.author.name,
        authorUrl: item.author.url,
        palette: item.palette,
        total: item.total,
        licenseTitle: item.license.title,
        licenseUrl: item.license.url,
        samples: item.samples,
        tags: item.tags,
      });
    }
    setCollections(_collections);
  };

  const pushIconsToSvgs = async (prefix: string, ids: string[], size: number) => {
    const response = await iconifyApi.icons(prefix, ids);
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
      setSvgs(e => [
        ...e,
        {
          key,
          top,
          left,
          width,
          height,
          body,
          prefix,
          isAnimate: body.includes('<animate'),
          filePath: existsLocal?.filePath,
        },
      ]);
    }
  };

  const search = async () => {
    if (!searchValue) return;
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
    for (const [key, item] of Object.entries(prefixIcons)) {
      const target = response.collections[key];
      await pushIconsToSvgs(key, item, target.displayHeight || target.height);
    }
  };

  useEffect(() => {
    initail();
  }, []);

  return {
    svgs,
    collections,
    setSearchValue,
    search,
  };
};

type Collection = {
  key: string;
  name: string;
  authorName: string;
  authorUrl: string;
  licenseTitle: string;
  licenseUrl: string;
  palette: boolean;
  total: number;
  samples: string[];
  tags: string[];
};
