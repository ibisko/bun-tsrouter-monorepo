type ColorScheme = 'light' | 'dark';

type ThemeAttrs = {
  'data-color-scheme': ColorScheme;
  'data-theme'?: string;
};

type ThemeConfig = Record<string, ThemeAttrs>;
export type Theme = 'light' | 'dark' | 'pur-dark';
export type ThemeStore = { theme: Theme; isDark: boolean };

export const themeConfig = {
  light: { 'data-color-scheme': 'light' } satisfies ThemeAttrs,
  dark: { 'data-color-scheme': 'dark', 'data-theme': 'dark' } satisfies ThemeAttrs,
  'pur-dark': { 'data-color-scheme': 'dark', 'data-theme': 'pur-dark' } satisfies ThemeAttrs,
} satisfies ThemeConfig;
