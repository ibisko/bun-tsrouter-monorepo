import '@packages/tsrouter/server';
declare module '@packages/tsrouter/server' {
  interface Context {
    userId: number;
  }
}
