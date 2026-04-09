import { useEffect, useState } from 'react';
import { iconifyApi } from './api';

export const useIconSets = () => {
  const [collections, setCollections] = useState<IconCollection[]>([]);

  const initail = async () => {
    const response = await iconifyApi.collections();
    const _collections: IconCollection[] = [];
    for (const [key, item] of Object.entries(response)) {
      if (item.hidden) continue;
      _collections.push({
        key,
        name: item.name,
        height: item.displayHeight || item.height || 16,
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

  useEffect(() => {
    initail();
  }, []);

  return {
    collections,
  };
};



export type IconCollection = {
  key: string;
  name: string;
  height: number;
  authorName: string;
  authorUrl: string;
  licenseTitle: string;
  licenseUrl: string;
  palette: boolean;
  total: number;
  samples: string[];
  tags: string[];
};

