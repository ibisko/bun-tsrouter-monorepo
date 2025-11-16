import yaml from 'yaml';
import path from 'path';
import fs from 'fs';
import { merge } from 'lodash-es';

// 常量文件配置
const yamlConfigFolder = path.join(process.cwd(), './config');

// 私有环境变量
class GlobalConfig {
  #config = {}; // todo 所有配置放这里去

  get config() {
    return this.#config;
  }

  /** 加载配置文件 */
  loadDefaultConfig() {
    const env = yaml.parse(readYamlConfig('base.yaml'));
    const inheritEnv = yaml.parse(readYamlConfig(`${process.env.NODE_ENV}.yaml`));
    merge(this.config, env, inheritEnv);
  }
}

const readYamlConfig = (filename: string) => {
  const filePath = path.join(yamlConfigFolder, filename);
  if (!fs.existsSync(filePath)) throw new Error(`配置文件不存在 ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
};

export const globalConfigInstance = new GlobalConfig();

// todo 定义全局配置
type Config = {
  port: number;
  authSecret: string;
  refreshAuthSecret: string;
};

export const config = globalConfigInstance.config as Config;
