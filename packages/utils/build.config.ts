import { defineConfig } from '@packages/tools/build';

export default defineConfig([
  // utils
  {
    watch: './src',
    entry: './src/index.ts',
    outDir: './dist/src',
  },
  {
    watch: './src-server',
    entry: './src-server/index.ts',
    outDir: './dist/server',
  },
  {
    watch: './src-web',
    entry: './src-web/index.ts',
    outDir: './dist/web',
  },
]);
