import { camelCase } from 'lodash-es';

export function pascalize(str: string) {
  const camel = camelCase(str);
  return camel.slice(0, 1).toUpperCase() + camel.slice(1);
}
