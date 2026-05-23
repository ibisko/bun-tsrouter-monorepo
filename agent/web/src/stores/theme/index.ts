import { LocalStorageEnum } from '@/enums/localStorage';
import { cloneDeep } from 'lodash-es';
import { proxy } from 'valtio';

import { themeConfig, type Theme, type ThemeStore } from './types';
import { applyHljsTheme } from './highlight';

const themes = Object.keys(themeConfig) as Theme[];
const isDarkTheme = (theme: Theme) => themeConfig[theme]['data-color-scheme'] === 'dark';

const applyTheme = (theme: Theme) => {
  const el = document.documentElement;
  el.removeAttribute('data-theme');
  el.removeAttribute('data-color-scheme');
  Object.entries(themeConfig[theme]).forEach(([key, value]) => el.setAttribute(key, value));
};

const initialTheme = (localStorage.getItem(LocalStorageEnum.Theme) || 'light') as Theme;
applyTheme(initialTheme);
applyHljsTheme(isDarkTheme(initialTheme));

export const themeStore = proxy<ThemeStore>(cloneDeep({ theme: initialTheme, isDark: isDarkTheme(initialTheme) }));

const switchTheme = () => {
  const next = themes[(themes.indexOf(themeStore.theme) + 1) % themes.length];
  themeStore.theme = next;
  themeStore.isDark = isDarkTheme(next);
  localStorage.setItem(LocalStorageEnum.Theme, next);
  applyTheme(next);
  applyHljsTheme(themeStore.isDark);
};

export const themeActions = {
  switchTheme,
};
