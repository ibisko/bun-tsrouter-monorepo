import path from 'path';
import { promises as fs } from 'fs';

/** 根据子项目拥有的的 package.json 获取到所有的子项目 */
const allRepo = async (cwd: string) => {
  const allPackageJsons = await Array.fromAsync(new Bun.Glob('**/package.json').scan({ cwd: cwd, onlyFiles: true }));
  return allPackageJsons.map(item => path.dirname(item)).filter(item => item !== '.');
};

const yamlToJson = async (filePath: string) => {
  if (!(await fs.exists(filePath))) {
    throw new Error('当前目录不存在 pnpm-workspace.yaml');
  }
  const yamlRuleContent = await Bun.file(filePath).text();
  const yamlRuleJson = await Bun.YAML.parse(yamlRuleContent);
  return yamlRuleJson as { packages: string[] };
};

/**
 * 根据 pnpm-workspace.yaml 规则过滤出符合的项目目录
 */
export const filterWorkspaceRule = async (cwd: string) => {
  const allScaneDir = await allRepo(cwd);

  // 规则过滤
  const pnpmWrokspaceYamlFilePath = path.join(cwd, 'pnpm-workspace.yaml');
  const yamlRuleJson = await yamlToJson(pnpmWrokspaceYamlFilePath);
  const includeRules: string[] = [];
  const ignoreRules: string[] = [];

  for (const rule of yamlRuleJson.packages) {
    if (rule.startsWith('!')) {
      ignoreRules.push(rule);
    } else {
      includeRules.push(rule);
    }
  }

  // 根据 pnpm-workspace.yaml 规则过滤
  const includePackagesSet = new Set<string>();
  for (const item of allScaneDir) {
    for (const rule of includeRules) {
      const canBeMatch = new Bun.Glob(rule).match(item);
      if (!canBeMatch) continue;
      includePackagesSet.add(item);
    }
    for (const rule of ignoreRules) {
      const canBeMatch = new Bun.Glob(rule).match(item);
      if (!canBeMatch) {
        includePackagesSet.delete(item);
      }
    }
  }

  return Array.from(includePackagesSet);
};
