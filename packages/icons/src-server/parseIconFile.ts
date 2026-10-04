import path from 'path';
import ts from 'typescript';
import { checkSvgIsAnimation, IconsComponentsDir } from './utils';
import { toSvgContent } from './toSvgContent';

const findNode = <T = ts.Node>(node: any, cb: (node: T) => boolean): T => {
  let result: T | undefined = undefined;
  node.forEachChild((item: T) => {
    const ok = cb(item);
    if (ok && !result) result = item;
  });
  return result as T;
};

const isExport = (node: ts.FunctionDeclaration) => !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export);

const getCommentKey = (sourceFile: ts.SourceFile, pos: number) => {
  const text = sourceFile.text;
  /** 从 pos 开始往前扫描，找到紧邻该节点的注释 */
  const commentRanges = ts.getLeadingCommentRanges(text, pos);
  if (!commentRanges) return { prefix: 'CUSTOM', name: sourceFile.fileName };

  const comment = commentRanges
    .filter(item => item.kind === ts.SyntaxKind.MultiLineCommentTrivia)
    .map(r => text.slice(r.pos, r.end))
    .at(-1);
  if (!comment) return { prefix: 'CUSTOM', name: sourceFile.fileName };

  const regexpComment = /^\/\*+\s*(\S+)\:(\S+)\s*\*+\/$/.exec(comment.trim());
  if (!regexpComment) return { prefix: 'CUSTOM', name: sourceFile.fileName };
  const prefix = regexpComment[1];
  const name = regexpComment[2];
  return { prefix, name };
};

const getViewBox = (viewBoxAttribute: ts.JsxAttribute) => {
  if (!!viewBoxAttribute.initializer && ts.isStringLiteral(viewBoxAttribute.initializer)) {
    const viewBoxList = viewBoxAttribute.initializer.text.split(/\s+/).map(item => +item);
    const [left, top, width, height] = viewBoxList;
    return { left, top, width, height };
  } else {
    throw new Error('no viewBox');
  }
};

const parseContnet = (sourceFile: ts.SourceFile) => {
  // export function
  const exportFunctionNode = findNode<ts.FunctionDeclaration>(sourceFile, node => ts.isFunctionDeclaration(node) && isExport(node));
  if (!exportFunctionNode) throw new Error('no exportFunctionNode');

  // name prefix
  const { prefix, name } = getCommentKey(sourceFile, exportFunctionNode.pos);

  // return
  const returnNode = findNode<ts.ReturnStatement>(exportFunctionNode.body, node => ts.isReturnStatement(node));
  if (!returnNode) throw new Error('no returnNode');

  // jsx svg
  const jsxNode = findNode<ts.JsxElement>(returnNode.expression!, node => ts.isJsxElement(node) && node.openingElement.tagName.getText() === 'svg');
  if (!jsxNode) throw new Error('no jsxNode');

  // viewBox
  const viewBoxAttribute = findNode<ts.JsxAttribute>(
    jsxNode.openingElement.attributes,
    node => ts.isJsxAttribute(node) && node.name.getText() === 'viewBox',
  );
  if (!viewBoxAttribute) throw new Error('no viewBoxAttribute');
  // viewBox left,top,width,height
  const viewBox = getViewBox(viewBoxAttribute);

  // svg 里面的<path>部分重新拿出来，转为 svg 格式
  let svgContent = ''; // jsxNode.children.map(toSvgContent);
  for (const item of jsxNode.children) {
    const content = toSvgContent(item);
    if (!content) continue;
    svgContent += content;
  }

  const isAnimate = checkSvgIsAnimation(svgContent);

  return { viewBox, prefix, name, isAnimate, svgContent };
};

export const parseIconFile = async (fileName: string) => {
  const filePath = path.join(IconsComponentsDir, fileName);
  const file = Bun.file(filePath);
  const filename = path.basename(filePath);
  const raw = await file.text();
  const sourceFile = ts.createSourceFile(filename, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const info = parseContnet(sourceFile);
  return { raw, filePath, ...info };
};
