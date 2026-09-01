import path from 'path';
import plimit from 'p-limit';
import { build } from 'tsdown';
import { startTimer, tsdownDefaultOptions, tsdownServerOptions } from './uitls';

type BuildWrapperParam = {
  cwd: string;
  watch: string;
  entry: string;
  outDir?: string;
  onlyDts?: boolean;
};

export class TsdownActions {
  plimit = plimit(1);

  constructor(private readonly rootDir: string) {}

  protected buildWrapper = ({ cwd, watch, entry, outDir, onlyDts }: BuildWrapperParam) => {
    const relativePath = path.join(cwd, watch);
    return {
      relativePath: relativePath,
      action: () =>
        this.plimit(async () => {
          const endTimer = startTimer(relativePath);
          const dir = path.join(this.rootDir, cwd);
          const options = onlyDts ? tsdownServerOptions : tsdownDefaultOptions;
          await build({
            ...options,
            entry: entry,
            outDir: outDir,
            cwd: dir,
          });
          endTimer();
        }),
    };
  };
}

type DefineConfigParam = {
  watch: string;
  entry: string;
  outDir?: string;
  onlyDts?: boolean;
};
export const defineConfig = (params: DefineConfigParam | DefineConfigParam[]) => (cwd: string) => {
  return function (this: TsdownActions) {
    if (Array.isArray(params)) {
      return params.map(item => this.buildWrapper({ ...item, cwd }));
    } else {
      return [this.buildWrapper({ ...params, cwd })];
    }
  };
};
