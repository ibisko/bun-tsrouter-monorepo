import path from 'path';
import { filterWorkspaceRule } from './filterWorkspaceRule';
import chalk from 'chalk';

const filterWorkspace = (dependence?: Record<string, string>) => {
  if (!dependence) return;
  return Object.entries(dependence)
    .filter(([_, val]) => val.startsWith('workspace:'))
    .map(([key]) => key);
};

type Topology = {
  name: string;
  dir: string;
  dependence: string[];
};

/** 根据子项目的 package.json 依赖，构建出串行拓扑 */
const buildTopologySort = async (cwd: string) => {
  const dirs = await filterWorkspaceRule(cwd);
  // 处理 package.json 里的依赖
  const mapScan = new Map<string, Topology>();
  const topologyList: Topology[] = [];

  // 构建串行拓扑
  for (const dir of dirs) {
    const packageJson = await Bun.file(path.join(cwd, dir, 'package.json')).json();
    const depSet = new Set<string>();
    filterWorkspace(packageJson.dependencies)?.forEach(item => depSet.add(item));
    filterWorkspace(packageJson.devDependencies)?.forEach(item => depSet.add(item));
    const dependence = Array.from(depSet);
    const ssp: Topology = {
      name: packageJson.name,
      dir: dir,
      dependence,
    };
    mapScan.set(ssp.name, ssp);
    topologyList.push(ssp);
  }
  return topologyList;
};

const detectCircularDependencies = (topologyList: Topology[]) => {
  const checkedSet = new Set<string>();
  const topologyMap = new Map<string, Topology>();
  topologyList.forEach(item => topologyMap.set(item.name, item));

  const dfs = (currentPath: Set<string>, name: string) => {
    for (const dep of topologyMap.get(name)!.dependence) {
      if (checkedSet.has(dep)) continue;
      const nextPath = new Set<string>(currentPath);
      if (nextPath.has(dep)) {
        console.log(`${chalk.redBright('\nError: 禁止循环依赖!')}\n${[...nextPath, dep].map(pkg => chalk.green(pkg)).join(chalk.gray(' -> '))}\n`);
        process.exit(1);
      }
      nextPath.add(dep);
      dfs(nextPath, dep);
      checkedSet.add(dep);
    }
  };

  for (const item of topologyList) {
    if (checkedSet.has(item.name)) continue;
    const currentPath = new Set<string>([item.name]);
    dfs(currentPath, item.name);
  }
};

/**
 * 检测禁止循环依赖
 * 根据依赖，对串行拓扑排序
 */
export const topologySort = async (cwd: string) => {
  const topologyList = await buildTopologySort(cwd);

  // 检测禁止循环依赖
  detectCircularDependencies(topologyList);

  // 根据依赖，对串行拓扑排序
  let currentIndex = 0;
  while (currentIndex < topologyList.length) {
    const item = topologyList[currentIndex];
    if (!item?.dependence.length) {
      currentIndex++;
      continue;
    }
    const lastIndex = topologyList.findLastIndex(sub => item.dependence.includes(sub.name));
    if (lastIndex > currentIndex) {
      // 如果 dependence 存在当前item之后存在的，就移动到后面去
      topologyList.splice(lastIndex + 1, 0, item);
      topologyList.splice(currentIndex, 1);
    } else {
      currentIndex++;
    }
  }

  return topologyList.map(item => item.dir);
};
