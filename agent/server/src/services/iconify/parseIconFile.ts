import path from 'path';
import ts from 'typescript';
import prettier from 'prettier';

const findNode = <T = ts.Node>(node: any, cb: (node: T) => boolean): T => {
  let result: T | undefined = undefined;
  node.forEachChild((item: T) => {
    const ok = cb(item);
    if (ok && !result) result = item;
  });
  return result as T;
};

const isExport = (node: ts.FunctionDeclaration) => !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export);

const getCommentKey = (text: string, pos: number) => {
  /** 从 pos 开始往前扫描，找到紧邻该节点的注释 */
  const commentRanges = ts.getLeadingCommentRanges(text, pos);
  if (!commentRanges) throw new Error('no commentRanges');

  const comment = commentRanges
    .filter(item => item.kind === ts.SyntaxKind.MultiLineCommentTrivia)
    .map(r => text.slice(r.pos, r.end))
    .at(-1);
  if (!comment) throw new Error('no comment');

  const regexpComment = /^\/\*+\s*((\S+)\:\S+)\s*\*+\/$/.exec(comment.trim());
  if (!regexpComment) throw new Error('no match prefix and key');
  const key = regexpComment[1];
  const prefix = regexpComment[2];
  return { prefix, key };
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

  // key prefix
  const { key, prefix } = getCommentKey(sourceFile.text, exportFunctionNode.pos);

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

  // svg children content
  const rawSvgContent = jsxNode.children
    .filter(node => node.kind !== ts.SyntaxKind.JsxText || node.getText().trim())
    .map(node => node.getText().trim())
    .join('\n');

  const isAnimate = rawSvgContent.includes('<animate');

  return { viewBox, prefix, key, rawSvgContent, isAnimate };
};

export const parseIconFile = async (filePath: string) => {
  const file = Bun.file(filePath);
  const filename = path.basename(filePath);
  const raw = await file.text();
  const sourceFile = ts.createSourceFile(filename, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const { viewBox, prefix, key, rawSvgContent, isAnimate } = parseContnet(sourceFile);

  const body = await prettier.format(rawSvgContent, { parser: 'html' });

  return { viewBox, raw, body, prefix, key, isAnimate };
};
