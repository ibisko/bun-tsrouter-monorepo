/**
 * bun app -c hello
 */

// import { text } from '@clack/prompts';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const argvs = process.argv.slice(2);
const action = argvs[0];

type WritePackageJson = {
  appName: string;
  appDir: string;
};
const writePackageJson = ({ appName, appDir }: WritePackageJson) => {
  const packageJsonFile = path.join(__dirname, './libs/createApp', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile).toString());
  packageJson.name = appName;
  fs.writeFileSync(path.join(appDir, path.basename(packageJsonFile)), JSON.stringify(packageJson, null, 2));
};

const copyFilesToDir = (files: string[], toDir: string) =>
  files.forEach(filePath => {
    const fileName = path.basename(filePath);
    fs.copyFileSync(filePath, path.join(toDir, fileName));
  });

async function createApp() {
  const appName = argvs[1]!;
  console.log('appName:', appName);
  const appDir = path.join(process.cwd(), 'apps', appName);
  fs.mkdirSync(appDir, { recursive: true });
  fs.mkdirSync(path.join(appDir, 'src'), { recursive: true });

  writePackageJson({ appName, appDir });

  copyFilesToDir([path.join(__dirname, './libs/createApp', 'tsconfig.json')], appDir);
  copyFilesToDir([path.join(__dirname, './libs/createApp', 'main.ts')], path.join(appDir, 'src'));
  await new Promise(r => exec('bun i --no-cache', { cwd: appDir }, r));
}

~(async function () {
  if (action === '-c') {
    // await text({ message: '开始' });
    await createApp();
  }
})();
