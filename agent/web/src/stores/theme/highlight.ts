import hljsDarkUrl from 'highlight.js/styles/github-dark.min.css?url';
import hljsLightUrl from 'highlight.js/styles/github.min.css?url';

const hljsLink = Object.assign(document.createElement('link'), { rel: 'stylesheet' });
document.head.appendChild(hljsLink);

export const applyHljsTheme = (isDark: boolean) => {
  hljsLink.href = isDark ? hljsDarkUrl : hljsLightUrl;
};
