import { LocalStorageEnum } from '@/enums/localStorage';
import { cloneDeep } from 'lodash-es';
import { proxy } from 'valtio';

type ThemeStore = {
  isDark: boolean;
};

const initialIsDark = !!+(localStorage.getItem(LocalStorageEnum.IsDark) || '0');
if (initialIsDark) {
  document.documentElement.classList.add('dark');
}
const initialThemeStore: ThemeStore = {
  isDark: initialIsDark,
};

const themeStore = proxy<ThemeStore>(cloneDeep(initialThemeStore));

const switchTheme = () => {
  themeStore.isDark = !themeStore.isDark;
  localStorage.setItem(LocalStorageEnum.IsDark, `${+themeStore.isDark}`);
  if (themeStore.isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const themeActions = {
  switchTheme,
};
