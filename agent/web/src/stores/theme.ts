import { LocalStorageEnum } from '@/enums/localStorage';
import { cloneDeep } from 'lodash-es';
import { proxy } from 'valtio';

type ColorScheme = 'light' | 'dark';

type ThemeAttrs = {
  'data-color-scheme': ColorScheme;
  'data-theme'?: string;
};

type ThemeConfig = Record<string, ThemeAttrs>;

const themeConfig = {
  light: { 'data-color-scheme': 'light' } satisfies ThemeAttrs,
  dark: { 'data-color-scheme': 'dark', 'data-theme': 'dark' } satisfies ThemeAttrs,
  'pur-dark': { 'data-color-scheme': 'dark', 'data-theme': 'pur-dark' } satisfies ThemeAttrs,
} satisfies ThemeConfig;

type Theme = keyof typeof themeConfig;

const themes = Object.keys(themeConfig) as Theme[];

type ThemeStore = { theme: Theme };

const applyTheme = (theme: Theme) => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-color-scheme');
  Object.entries(themeConfig[theme]).forEach(([key, value]) => {
    document.documentElement.setAttribute(key, value);
  });
};

const initialTheme = (localStorage.getItem(LocalStorageEnum.Theme) || 'light') as Theme;
applyTheme(initialTheme);

export const themeStore = proxy<ThemeStore>(cloneDeep({ theme: initialTheme }));

const switchTheme = () => {
  const nextIndex = (themes.indexOf(themeStore.theme) + 1) % themes.length;
  themeStore.theme = themes[nextIndex];
  localStorage.setItem(LocalStorageEnum.Theme, themeStore.theme);
  applyTheme(themeStore.theme);
};

export const themeActions = {
  switchTheme,
};
