import type { Collection, CollectionsResponse, IconsResponse, SearchResponse } from './types';

const Host = 'https://api.iconify.design';

type ListParams = {
  prefix?: string;
  info?: boolean;
  chars?: boolean;
};

const request = async <T>(path: string, params?: Record<string, unknown>): Promise<T> => {
  const url = new URL(path, Host);
  Object.entries(params ?? {}).forEach(([k, v]) => v != null && v !== '' && url.searchParams.append(k, String(v)));
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const iconifyApi = {
  collections: (params?: ListParams) => request<CollectionsResponse>('/collections', params),
  collection: (params: ListParams & { prefix: string }) => request<Collection>('/collection', params),
  icons: (prefix: string, ids: string[]) => request<IconsResponse>(`/${prefix}.json`, { icons: ids.join() }),
  search: (params: { query: string; limit?: number }) => request<SearchResponse>('/search', params),
};




// https://api.iconify.design/search?query=hom&pretty=1

// https://api.iconify.design/keywords?prefix=hom&pretty=1
// /keywords?keyword=home&pretty=1
// /search?query=home&pretty=1
// /search?query=arrows-horizontal&pretty=1&limit=999
