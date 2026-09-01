import { defineConfig } from '@packages/tools/build';

export default defineConfig([
  {
    watch: './src-server',
    entry: './src-server/main.ts',
    outDir: './dist/server',
  },
  {
    watch: './src-client',
    entry: './src-client/main.ts',
    outDir: './dist/client',
  },
]);
