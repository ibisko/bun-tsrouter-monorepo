import { spawn } from 'child_process';

const spawnCmd = async (cwd: string, script: string) => {
  await new Promise(resolve => {
    const proc = spawn('bun', ['run', script], { cwd, stdio: 'inherit' });
    proc.on('exit', () => {
      resolve(null);
    });
  });
};

// 等待所有任务完成（或任意一个失败）
~(async function () {
  Promise.all([
    spawnCmd('./packages/utils', "dev"),
    spawnCmd('./packages/ui', "dev"),
    spawnCmd('./packages/tsrouter', "dev")
  ]);
  await Bun.sleep(1e3*2)
  await Promise.all([
    spawnCmd('./apps/web', "dev"),
    spawnCmd('./apps/server', "dev")
  ]);
})();
