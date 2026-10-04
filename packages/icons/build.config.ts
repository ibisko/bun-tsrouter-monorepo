import { defineConfig } from '@packages/tools/build';

export default defineConfig([
  {
    watch: './src',
    entry: './src/index.ts',
    outDir: './dist/src',
  },
  {
    watch: './src-server',
    entry: './src-server/main.ts',
    outDir: './dist/server',
  },
]);
