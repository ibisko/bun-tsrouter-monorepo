import { spawn } from 'child_process';

const spawnCmd = async (cwd: string, script: string) => {
  console.log(cwd, script);
  await new Promise(resolve => {
    const proc = spawn('bun', ['run', script], { cwd, stdio: 'inherit' });
    proc.on('exit', () => {
      resolve(null);
    });
  });
};

async function main() {
  Bun.spawnSync(['bun', 'i'], {});
  await spawnCmd('./packages/utils', 'build');
  await spawnCmd('./packages/ui', 'build');
  await spawnCmd('./packages/tsrouter', 'build');
  await spawnCmd('./apps/server', 'generate');
  await spawnCmd('./apps/server', 'diff');
  await spawnCmd('./apps/server', 'execute');
}
main();
