import prettier, { BuiltInParserName, LiteralUnion } from 'prettier';
import { PrettierrcJsonFile } from '@/common/path';

export const prettierFormat = async (code: string, parser: LiteralUnion<BuiltInParserName>) => {
  const prettierrcJson = await Bun.file(PrettierrcJsonFile).json();
  return await prettier.format(code, {
    parser: parser,
    ...prettierrcJson,
  });
};
