import { type IconifyJSON } from '@iconify/types';
import { jsonRequest } from '@packages/utils';

export type SyncIconSetsItem = {
  name: string; // "academicons.json"
  sha: string; // "9a6ba1528f0c6e540e32597d921c169b5fb94d09"
  size: number; // 294392
  download_url: string; // "https://raw.githubusercontent.com/iconify/icon-sets/master/json/academicons.json"
  type: 'file';
  // "path": string // "json/academicons.json"
};

export const fetchAllIconSet = async () => {
  const url = 'https://api.github.com/repos/iconify/icon-sets/contents/json';

  const headers = new Headers();
  if (process.env.GITHUB_TOKEN) {
    headers.append('Authorization', process.env.GITHUB_TOKEN);
  }

  const response = await jsonRequest({ method: 'GET', url: url, headers });
  const data = await response.json();
  return data as SyncIconSetsItem[];
};

export const fetchIconSet = async (fileName: string) => {
  const url = `https://raw.githubusercontent.com/iconify/icon-sets/master/json/${fileName}`;

  const headers = new Headers({
    // accept: "application/vnd.github+json",
    'Accept-Encoding': 'gzip, deflate, br',
  });
  if (process.env.GITHUB_TOKEN) {
    headers.append('Authorization', process.env.GITHUB_TOKEN);
  }

  const response = await jsonRequest({ method: 'GET', url: url, headers });

  let dataStr = '';
  for await (const chunk of response.body!.pipeThrough(new TextDecoderStream())) {
    dataStr += chunk;
  }

  return JSON.parse(dataStr.trim()) as IconifyJSON;
};
