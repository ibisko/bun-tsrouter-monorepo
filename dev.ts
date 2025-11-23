const exec = (cwd: string) =>
  Bun.spawn(['bun', 'run', 'dev'], {
    cwd,
    stdout: 'inherit', // 输出到当前终端
  });

// 等待所有任务完成（或任意一个失败）
~(async function () {
  Promise.all([exec('./packages/utils'), exec('./packages/ui'), exec('./packages/tsrouter')]);
  await new Promise(r => setTimeout(r, 1e3));
  await Promise.all([exec('./apps/web'), exec('./apps/server')]);
})();
