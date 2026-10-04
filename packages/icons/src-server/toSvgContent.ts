import { kebabCase } from 'lodash-es';
import ts from 'typescript';

/** SVG 规范里原生就是驼峰的属性，kebabCase 会破坏（viewBox → view-box、repeatCount → repeat-count） */
const camelAttrs = new Set([
  'viewBox',
  'preserveAspectRatio',
  // SMIL 动画属性族
  'attributeName',
  'attributeType',
  'calcMode',
  'keyPoints',
  'keySplines',
  'keyTimes',
  'repeatCount',
  'repeatDur',
]);

/** JSX 属性名 → SVG 属性名 */
const toSvgAttrName = (rawName: string) => {
  // 已是横杠/命名空间写法（data-*、xlink:href）原样保留
  if (rawName.includes('-') || rawName.includes(':')) return rawName;
  if (camelAttrs.has(rawName)) return rawName;
  // JSX 里写不了冒号，React 用驼峰表示命名空间属性
  if (rawName === 'xmlnsXlink') return 'xmlns:xlink';
  if (rawName === 'xlinkHref') return 'xlink:href';
  return kebabCase(rawName); // strokeWidth → stroke-width, fillRule → fill-rule
};

const toSvgAttr = (attr: ts.JsxAttribute) => {
  const name = toSvgAttrName(attr.name.getText());
  if (!attr.initializer) return name;
  // StringLiteral 用 text（不带引号）；JsxExpression 兜底
  const value = ts.isStringLiteral(attr.initializer) ? attr.initializer.text : attr.initializer.getText();
  return `${name}="${value}"`;
};

/** JSX 子节点还原成 SVG 片段 */
export const toSvgContent = (node: ts.JsxChild | ts.JsxOpeningElement): string => {
  if (ts.isJsxText(node)) return node.getText().trim();
  if (ts.isJsxExpression(node)) return ''; // {expr} 不属于 SVG
  if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
    const attrs = node.attributes.properties.filter(ts.isJsxAttribute).map(toSvgAttr);
    return `<${node.tagName.getText()}${attrs.length ? ' ' + attrs.join(' ') : ''}${ts.isJsxSelfClosingElement(node) ? ' />' : '>'}`;
  }
  if (ts.isJsxElement(node)) {
    const children = node.children.map(toSvgContent).join('');
    return `${toSvgContent(node.openingElement)}${children}</${node.openingElement.tagName.getText()}>`;
  }
  return '';
};
