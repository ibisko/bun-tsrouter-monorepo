export interface CollectionsInfo {
  name: string;
  total: number;
  author: { name: string; url: string };
  license: { title: string; spdx: string; url: string };
  samples: string[];
  height: number;
  category: string;
  tags: string[];
  palette: boolean;
}

/** Keyed by collection id (e.g. "material-symbols", "mdi") */
export type CollectionsResponse = Record<string, CollectionsInfo>;

export type Collection = {
  prefix: string;
  total: number;
  title: string;
  info: CollectionsInfo;
  uncategorized: string[] | Record<string, string[]>;
  aliases: Record<string, string>;
};

export type IconsResponse = {
  prefix: string;
  lastModified: number;
  aliases: Record<string, { parent: string }>;
  width: number;
  height: number;
  icons: Record<string, { body: string; top?: number; left?: number; width?: number; height?: number }>;
};

export type SearchResponse = {
  icons: `${string}:${string}`[];
  total: number;
  limit: number;
  start: number;
  collections: Record<string, CollectionsInfo & { version?: string; displayHeight?: number }>;
  request: {
    query: string;
    limit: string;
  };
};
