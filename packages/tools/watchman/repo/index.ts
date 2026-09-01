import path from 'path';
import { promises as fs } from 'fs';
import { TsdownActions } from '../TsdownActions';
import { topologySort } from './topologySort';

/**
 * 根据串行拓扑的有序子项目，导入可能存在的 build.config.ts
 */
export async function repo(tsdownActions: TsdownActions) {
  const cwd = process.cwd();
  const subDir = await topologySort(cwd);
  const buildConfigs = [];
  for (const dir of subDir) {
    const buildConfigTs = path.join(cwd, dir, 'build.config.ts');
    const exists = await fs.exists(buildConfigTs);
    if (exists) {
      const imp = await import(buildConfigTs);
      const buildConfig = imp.default(dir).call(tsdownActions);
      buildConfigs.push(...buildConfig);
    }
  }
  return buildConfigs;
}
