import { LocalStorageEnum } from '@/enums/localStorage';
import { cloneDeep } from 'lodash-es';
import { proxy } from 'valtio';

type Theme = 'light' | 'dark' | 'pur-dark';

type ThemeStore = {
  theme: Theme;
};

const themes: Theme[] = ['light', 'dark', 'pur-dark'];

const initialTheme = (localStorage.getItem(LocalStorageEnum.Theme) || 'light') as Theme;
if (initialTheme !== 'light') {
  document.documentElement.setAttribute('data-theme', initialTheme);
}
const initialThemeStore: ThemeStore = {
  theme: initialTheme,
};

export const themeStore = proxy<ThemeStore>(cloneDeep(initialThemeStore));

const switchTheme = () => {
  const nextIndex = (themes.indexOf(themeStore.theme) + 1) % themes.length;
  themeStore.theme = themes[nextIndex];
  localStorage.setItem(LocalStorageEnum.Theme, themeStore.theme);
  if (themeStore.theme === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeStore.theme);
  }
};

export const themeActions = {
  switchTheme,
};
