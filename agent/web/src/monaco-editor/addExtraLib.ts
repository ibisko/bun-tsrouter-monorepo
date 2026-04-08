import * as monaco from 'monaco-editor';
import ReactTypesRaw from './react-types/index.d.ts?raw';
import ReactGlobalTypesRaw from './react-types/global.d.ts?raw';

monaco.typescript.typescriptDefaults.addExtraLib(
  `declare module "@packages/ui" {
  export function cn(...args: any[]): string;
}`,
  'file:///@types/global.d.ts',
);

monaco.typescript.typescriptDefaults.addExtraLib(ReactTypesRaw, 'file:///@types/react/index.d.ts');
monaco.typescript.typescriptDefaults.addExtraLib(ReactGlobalTypesRaw, 'file:///@types/react/global.d.ts');

export const addExtraLib = () => {};
