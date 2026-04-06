import { useEffect, useState } from 'react';
import { iconifyApi } from './api';

export const useIconSets = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [svgs, setSvgs] = useState<SvgInfo[]>([]);
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
      const key = aliase?.parent ?? id;
      const target = response.icons[key];
      const path = target?.body;
      if (!path) {
        console.log('no body', { prefix, key, response });
        continue;
      }

      /**
       * 注意默认就是16
       * https://iconify.design/docs/types/iconify-json.html#icon
       */
      const height = target.height || response.height || size || 16;
      const width = target.width || response.width || height;
      const top = target.top || 0;
      const left = target.left || 0;
      if (!(response.height || size)) {
        console.log('no height', response);
      }
      setSvgs(e => [
        ...e,
        {
          key: `${prefix}:${id}`,
          top,
          left,
          width,
          height,
          path,
          prefix,
          id: key,
          isAnimate: path.includes('<animate'),
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
  //   version?: string;
  authorUrl: string;
  licenseTitle: string;
  licenseUrl: string;
  palette: boolean;
  total: number;
  samples: string[];
  tags: string[];
};

export type SvgInfo = {
  key: string;
  top?: number;
  left?: number;
  width?: number;
  height: number;
  path: string;
  prefix: string;
  id: string;
  isAnimate?: boolean;
};
