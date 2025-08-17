import { parse } from 'yaml';
import path from 'path';
import fs from 'fs';

// 常量文件配置
const yamlConfigFolder = path.resolve(__dirname, '..', 'config');

// 私有环境变量
class Config {
  port: number = 0;

  constructor() {
    // 加载配置文件
    const env = parse(this.readYamlConfig('base.yaml'));
    const inheritEnv = parse(this.readYamlConfig(`${process.env.NODE_ENV}.yaml`));
    Object.assign(env, inheritEnv);
    console.log(env);

    // 异步加载其他配置
    // sqlite
  }

  readYamlConfig(filename: string) {
    const filePath = path.join(yamlConfigFolder, filename);
    if (!fs.existsSync(filePath)) throw new Error(`配置文件不存在 appps/server/config/${filename}`);
    return fs.readFileSync(filePath, 'utf8');
  }
}

export default new Config();
