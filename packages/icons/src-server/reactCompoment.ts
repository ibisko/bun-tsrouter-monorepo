import type { MaybePromise } from 'bun';
import { svgKebabToCamel } from './svgKebabToCamel';
import { IconsComponentsDir, pascalize } from './utils';
import path from 'path';

// todo 应该是在service缓存本地icon，这里返回是否是本地的图标

type ReactCompomentParam = {
  sign: string;
  top: number;
  left: number;
  width: number;
  height: number;
  body: string;
};

export async function reactCompoment({ sign, body, top, left, width, height }: ReactCompomentParam, format?: (code: string) => MaybePromise<string>) {
  const codes = ["import type { SVGProps } from 'react';\n"];

  if (sign) {
    codes.push(`/** ${sign} */`);
  }

  const componentName = pascalize(sign);
  body = svgKebabToCamel(body);
  codes.push(
    `export function ${componentName}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="${`${left} ${top} ${width} ${height}`}"
      width="1em"
      height="1em"
      {...props}
    >
    ${body}
    </svg>
  )
}`,
  );

  let code = codes.join('\n');
  if (format) {
    code = await format(code);
  }

  const filePath = path.join(IconsComponentsDir, `${componentName}.tsx`);

  return { componentName, filePath, code };
}
