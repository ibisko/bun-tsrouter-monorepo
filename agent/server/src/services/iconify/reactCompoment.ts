import { PrettierrcJsonFile } from '@/common/path';
import { iconIncoSchema, IconInfo } from '@packages/icons';

import prettier from 'prettier';
import { svgKebabToCamel } from './svgKebabToCamel';
import { procedure } from '@packages/tsrouter/server';
import { pascalize } from '@packages/icons';

export async function reactCompoment(icon: IconInfo) {
  icon.body = svgKebabToCamel(icon.body);

  const keyName = pascalize(icon.key);
  const fileName = `${keyName}.tsx`;

  let code = `import type { SVGProps } from 'react';

/** ${icon.key} */
export function ${keyName}(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${`${icon.left} ${icon.top} ${icon.width} ${icon.height}`}" width="1em" height="1em" {...props}>
            ${icon.body}
        </svg>
    )
}
`;

  const prettierrcJson = await Bun.file(PrettierrcJsonFile).json();
  code = await prettier.format(code, {
    parser: 'typescript',
    ...prettierrcJson,
  });

  return { code, fileName };
}

export const reactCompomentRouter = procedure.post(iconIncoSchema, reactCompoment);
