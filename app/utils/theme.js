let currentTheme = null;

export const THEME_COOKIE = 'pureCloudTheme';

export const TEN_YEARS = 315360000; // in seconds

export const THEME_CLASSES = {
    ORIGINAL: 'original-theme',
    LIGHT: 'light-theme',
    DARK: 'dark-theme',
    BASE: 'purecloud-theme'
};

export const THEME_LIST = ['light-theme', 'dark-theme'];

export const SUPPORTED_THEMES = ['original-theme', ...THEME_LIST];

export const DEFAULT_THEME = THEME_CLASSES.LIGHT;

export function loadCachedTheme(cookies = document.cookie) {
    let cookie = cookies
        .split(/;[ \t]?/)
        .map(cookie => {
            let [name, theme] = cookie.split('=');
            return { name, theme };
        })
        .find(({ name }) => name === THEME_COOKIE);

    if (cookie && SUPPORTED_THEMES.find(theme => theme === cookie.theme)) {
        return cookie;
    } else {
        return { theme: THEME_CLASSES.ORIGINAL };
    }
}

export function getThemeClass() {
    return currentTheme;
}
