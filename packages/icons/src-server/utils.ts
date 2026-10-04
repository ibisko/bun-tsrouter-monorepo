import { camelCase } from 'lodash-es';
import path from 'path';

export const IconsComponentsDir = path.join(__dirname, '../../src');
// export const IconsComponentsDir = path.join(__dirname, '../src');

export function pascalize(str: string) {
  const camel = camelCase(str);
  return camel.slice(0, 1).toUpperCase() + camel.slice(1);
}

export const checkSvgIsAnimation = (content: string) => /[\<animate|\<animateTransform|\<animateMotion|\<set]\s/.test(content);
