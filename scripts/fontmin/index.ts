import path from 'path';
import { fontmin } from './core';

fontmin({
  folders: path.join(__dirname, '../..', 'apps/web/src'),
  from: path.join(__dirname, '../..', 'packages/ui/fonts', 'LXGWWenKaiMono-Medium.ttf'),
  to: path.join(__dirname, '../..', 'packages/ui/fonts', 'LXGWWenKaiMono-Medium.woff2'),
});
