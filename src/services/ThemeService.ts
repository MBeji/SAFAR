export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

const THEME_STORAGE_KEY = 'wellbeing-theme';

export const LIGHT_THEME: ThemeConfig = {
  theme: 'light',
  colors: {
    primary: '#007AFF',
    secondary: '#5AC8FA',
    background: '#F2F2F7',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#1C1C1E',
    textSecondary: 'rgba(28, 28, 30, 0.7)',    border: 'rgba(28, 28, 30, 0.1)',
    success: '#30D158',
    warning: '#FF9500',
    error: '#FF3B30'
  }
};

export const DARK_THEME: ThemeConfig = {
  theme: 'dark',
  colors: {
    primary: '#0A84FF',
    secondary: '#64D2FF',
    background: 'linear-gradient(135deg, #000000 0%, #1C1C1E 50%, #2C2C2E 100%)',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#F2F2F7',
    textSecondary: 'rgba(242, 242, 247, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A'
  }
};

export class ThemeService {
  static getCurrentTheme(): Theme {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as Theme) || 'auto';
    } catch {
      return 'auto';
    }
  }

  static setTheme(theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  static getThemeConfig(theme: Theme): ThemeConfig {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? DARK_THEME : LIGHT_THEME;
    }
    return theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  }
  static applyTheme(theme: Theme): void {
    const config = this.getThemeConfig(theme);
    const root = document.documentElement;

    // Appliquer les variables CSS
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Appliquer aussi le background sur body pour être sûr
    document.body.style.background = config.colors.background;
    document.body.style.color = config.colors.text;

    // Ajouter une classe pour les styles spécifiques
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${config.theme}`);
  }

  static initTheme(): void {
    const theme = this.getCurrentTheme();
    this.applyTheme(theme);

    // Écouter les changements de préférence système
    if (theme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.applyTheme('auto');
      });
    }
  }
}
