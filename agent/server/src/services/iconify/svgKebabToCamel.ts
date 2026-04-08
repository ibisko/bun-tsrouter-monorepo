import ts from 'typescript';
import { camelCase } from 'lodash-es';

/**
 * 将 SVG 内容中所有标签的 kebab-case 属性转换为 camelCase
 */
export function svgKebabToCamel(svgContent: string): string {
  const wrapped = `<svg>${svgContent}</svg>`;
  const sourceFile = ts.createSourceFile('svg.tsx', wrapped, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const transformer: ts.TransformerFactory<ts.Node> = _context => node => transformJsxNode(node);
  const result = ts.transform(sourceFile, [transformer]);
  const transformed = result.transformed[0] as ts.SourceFile;

  const printer = ts.createPrinter();
  const output = extractChildrenSource(transformed, printer);

  result.dispose();
  return output;
}

/** 判断属性名是否为 kebab-case */
function isKebabCase(name: string) {
  return name.includes('-');
}

/** 遍历属性列表，将 kebab-case 属性名转为 camelCase */
function transformAttributes(attributes: ts.NodeArray<ts.JsxAttributeLike>): ts.JsxAttributeLike[] {
  return attributes.map(attr => {
    if (!ts.isJsxAttribute(attr)) return attr;
    const name = attr.name.getText();
    if (!isKebabCase(name)) return attr;

    return ts.factory.createJsxAttribute(
      ts.factory.createIdentifier(camelCase(name)),
      attr.initializer ? (ts.visitNode(attr.initializer, n => n) as ts.JsxAttributeValue) : undefined,
    );
  });
}

/** 递归遍历 AST，转换所有 JSX 标签的属性 */
function transformJsxNode(node: ts.Node): ts.Node {
  if (ts.isJsxElement(node)) {
    const newAttrs = transformAttributes(node.openingElement.attributes.properties as ts.NodeArray<ts.JsxAttributeLike>);
    const newOpening = ts.factory.updateJsxOpeningElement(
      node.openingElement,
      node.openingElement.tagName,
      node.openingElement.typeArguments,
      ts.factory.createJsxAttributes(newAttrs),
    );
    const newClosing = ts.factory.updateJsxClosingElement(node.closingElement, node.closingElement.tagName);
    const newChildren = ts.visitNodes(node.children, child => transformJsxNode(child));
    return ts.factory.updateJsxElement(node, newOpening, newChildren as ts.NodeArray<ts.JsxChild>, newClosing);
  }

  if (ts.isJsxSelfClosingElement(node)) {
    const newAttrs = transformAttributes(node.attributes.properties as ts.NodeArray<ts.JsxAttributeLike>);
    return ts.factory.updateJsxSelfClosingElement(node, node.tagName, node.typeArguments, ts.factory.createJsxAttributes(newAttrs));
  }

  return ts.visitEachChild(node, child => transformJsxNode(child), undefined);
}

/** 从包装的 <svg> 根元素中提取子节点源码 */
function extractChildrenSource(root: ts.SourceFile, printer: ts.Printer): string {
  let jsxRoot: ts.JsxElement | undefined;
  ts.forEachChild(root, node => {
    if (ts.isExpressionStatement(node) && ts.isJsxElement(node.expression)) {
      jsxRoot = node.expression;
    }
  });
  if (!jsxRoot) throw new Error('无法找到根 JSX 元素');

  return jsxRoot.children
    .map(child => printer.printNode(ts.EmitHint.Unspecified, child, root))
    .join('\n')
    .trim();
}
